import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { createClient } from "@/utils/supabase/server";
import { analyzeTenderText } from "@/lib/gemini";
import { fetchAndCleanPage } from "@/lib/text-utils";
import { pLimit } from "@/lib/concurrency";
import { ScanResponse, Tender } from "@/types/tender";

// Configuration
const FEED_URL = "https://www.service.bund.de/Content/DE/Ausschreibungen/Suche/Formular.html?nn=4641482&resultsPerPage=100&sortOrder=dateOfIssue_dt+desc&jobsrss=true";
const MAX_NEW_ITEMS = 10;
const CONCURRENCY_LIMIT = 3;

interface RSSItem {
  title?: string;
  link?: string;
  content?: string;
  contentSnippet?: string;
  pubDate?: string;
}

export async function GET() {
  const logPrefix = "[TenderScan]";
  console.log(`${logPrefix} Starting scan...`);

  try {
    // 0. Pre-flight checks
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error(`${logPrefix} Missing GEMINI_API_KEY`);
      return NextResponse.json<ScanResponse>(
        { success: false, error: "Configuration Error: GEMINI_API_KEY missing" },
        { status: 500 }
      );
    }

    // 1. Fetch RSS Feed
    const parser = new Parser();
    let feed;
    try {
      feed = await parser.parseURL(FEED_URL);
    } catch (err) {
      console.error(`${logPrefix} RSS Parse Error:`, err);
      return NextResponse.json<ScanResponse>(
        { success: false, error: "Failed to parse RSS feed" },
        { status: 500 }
      );
    }

    if (!feed.items || feed.items.length === 0) {
      console.log(`${logPrefix} No items in feed`);
      return NextResponse.json<ScanResponse>({
        success: true,
        stats: { gefunden: 0, uebersprungen: 0, analysiert: 0, fehler: 0, verbleibend: 0 },
        message: "Keine Items im Feed gefunden",
      });
    }

    // 2. Collect URLs
    const feedUrls = feed.items
      .map((item: RSSItem) => item.link)
      .filter((url): url is string => !!url);

    if (feedUrls.length === 0) {
      return NextResponse.json<ScanResponse>({
        success: true,
        stats: { gefunden: 0, uebersprungen: 0, analysiert: 0, fehler: 0, verbleibend: 0 },
        message: "Keine URLs im Feed gefunden",
      });
    }

    // 3. Check DB for existing URLs
    const supabase = await createClient();
    const { data: existingTenders, error: dbError } = await supabase
      .from("tenders")
      .select("source_url")
      .in("source_url", feedUrls);

    if (dbError) {
      console.error(`${logPrefix} Database Error:`, dbError);
      return NextResponse.json<ScanResponse>(
        { success: false, error: "Datenbankfehler bei Duplikatprüfung" },
        { status: 500 }
      );
    }

    const existingUrls = new Set(existingTenders?.map((t) => t.source_url) || []);

    // 4. Filter new items
    const newItems = feed.items.filter(
      (item: RSSItem) => item.link && !existingUrls.has(item.link)
    );

    const skippedCount = feed.items.length - newItems.length;
    const itemsToProcess = newItems.slice(0, MAX_NEW_ITEMS);

    console.log(`${logPrefix} Found ${feed.items.length} items. New: ${newItems.length}. Processing: ${itemsToProcess.length}. Skipped: ${skippedCount}.`);

    if (itemsToProcess.length === 0) {
      return NextResponse.json<ScanResponse>({
        success: true,
        stats: {
          gefunden: feed.items.length,
          uebersprungen: skippedCount,
          analysiert: 0,
          fehler: 0,
          verbleibend: 0,
        },
        message: "Keine neuen Ausschreibungen gefunden",
      });
    }

    // 5. Process items concurrently
    const limit = pLimit(CONCURRENCY_LIMIT);
    const results: Partial<Tender>[] = [];
    const errors: { url?: string; error: string }[] = [];

    const tasks = itemsToProcess.map((item: RSSItem) =>
      limit(async () => {
        const itemUrl = item.link;
        if (!itemUrl) return;

        try {
          console.log(`${logPrefix} Processing: ${itemUrl}`);

          // Fetch content
          const pageContent = await fetchAndCleanPage(itemUrl);
          
          const textToAnalyze = pageContent
            ? `TITEL: ${item.title || ""}\n\nVOLLSTÄNDIGER AUSSCHREIBUNGSTEXT:\n${pageContent}`
            : `TITEL: ${item.title || ""}\nBESCHREIBUNG: ${item.contentSnippet || item.content || ""}\nLINK: ${itemUrl}`;

          // Analyze with Gemini
          const analysis = await analyzeTenderText(textToAnalyze, geminiApiKey);

          // Validate deadline
          let parsedDeadline: string | null = null;
          if (analysis.deadline && analysis.deadline !== "k.A.") {
             // Gemini is instructed to return YYYY-MM-DD
             const d = new Date(analysis.deadline);
             if (!isNaN(d.getTime())) {
                 parsedDeadline = analysis.deadline;
             }
          }

          // Insert into DB
          const tenderData = {
            title: item.title || "Unbekannt",
            description: analysis.description_short || null,
            location: analysis.location || null,
            budget: analysis.budget || null,
            deadline: parsedDeadline,
            category: analysis.category || null,
            source_url: itemUrl,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
            requirements: analysis.requirements || [],
          };

          const { error: insertError } = await supabase
            .from("tenders")
            .insert(tenderData);

          if (insertError) {
            // Fallback: Try inserting without requirements if column missing (Legacy schema support)
            if (insertError.message.includes('column "requirements" of relation "tenders" does not exist')) {
                 console.warn(`${logPrefix} 'requirements' column missing. Retrying without it.`);
                 const { requirements, ...tenderDataWithoutReq } = tenderData;
                 const { error: retryError } = await supabase
                    .from("tenders")
                    .insert(tenderDataWithoutReq);
                 
                 if (retryError) throw new Error(retryError.message);
            } else {
                throw new Error(insertError.message);
            }
          }

          results.push({
            title: tenderData.title,
            source_url: tenderData.source_url,
            budget: analysis.budget,
            location: analysis.location,
            category: analysis.category,
          });

        } catch (err) {
          console.error(`${logPrefix} Error processing ${itemUrl}:`, err);
          errors.push({
            url: itemUrl,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }
      })
    );

    await Promise.all(tasks);

    console.log(`${logPrefix} Completed. Analyzed: ${results.length}. Errors: ${errors.length}.`);

    return NextResponse.json<ScanResponse>({
      success: true,
      stats: {
        gefunden: feed.items.length,
        uebersprungen: skippedCount,
        analysiert: results.length,
        fehler: errors.length,
        verbleibend: newItems.length - itemsToProcess.length,
      },
      message: `${results.length} von ${newItems.length} neuen Einträgen analysiert`,
      processed: results,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error("[TenderScan] Fatal Error:", error);
    return NextResponse.json<ScanResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 }
    );
  }
}
