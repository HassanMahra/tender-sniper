import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";

const FEED_URL =
  "https://www.service.bund.de/Content/DE/Ausschreibungen/Suche/Formular.html?nn=4641482&resultsPerPage=100&sortOrder=dateOfIssue_dt+desc&jobsrss=true";

const MAX_NEW_ITEMS = 10; // Strenge Mengenbegrenzung für KI-Analyse

interface RSSItem {
  title?: string;
  link?: string;
  content?: string;
  contentSnippet?: string;
  pubDate?: string;
}

interface GeminiResult {
  budget: string;
  budget_is_estimate: boolean;
  location: string;
  category: string;
  deadline: string;
  description_short: string;
  requirements: string[];
}

/**
 * Extrahiert den reinen Text aus einer HTML-Seite
 */
async function fetchPageContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TenderBot/1.0)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "de-DE,de;q=0.9",
      },
      signal: AbortSignal.timeout(15000), // 15 Sekunden Timeout
    });

    if (!response.ok) {
      console.error(`Fetch failed for ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // HTML zu reinem Text konvertieren
    // Entferne Script und Style Tags komplett
    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "");

    // HTML-Tags entfernen
    text = text.replace(/<[^>]+>/g, " ");

    // HTML-Entities dekodieren
    text = text
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)));

    // Mehrfache Leerzeichen und Zeilenumbrüche reduzieren
    text = text.replace(/\s+/g, " ").trim();

    // Limitiere auf 8000 Zeichen für Gemini
    return text.slice(0, 8000);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    // 1. RSS Feed abrufen
    const parser = new Parser();
    const feed = await parser.parseURL(FEED_URL);

    if (!feed.items || feed.items.length === 0) {
      return NextResponse.json({
        success: true,
        stats: { gefunden: 0, uebersprungen: 0, analysiert: 0, verbleibend: 0 },
        message: "Keine Items im Feed gefunden",
      });
    }

    // 2. Alle source_urls aus dem Feed sammeln
    const feedUrls = feed.items
      .map((item: RSSItem) => item.link)
      .filter((url): url is string => !!url);

    if (feedUrls.length === 0) {
      return NextResponse.json({
        success: true,
        stats: { gefunden: 0, uebersprungen: 0, analysiert: 0, verbleibend: 0 },
        message: "Keine URLs im Feed gefunden",
      });
    }

    // 3. Supabase: Bereits existierende URLs abfragen (EINE Query)
    const supabase = await createClient();
    const { data: existingTenders, error: dbError } = await supabase
      .from("tenders")
      .select("source_url")
      .in("source_url", feedUrls);

    if (dbError) {
      console.error("Supabase Error:", dbError);
      return NextResponse.json(
        { success: false, error: "Datenbankfehler" },
        { status: 500 }
      );
    }

    const existingUrls = new Set(
      existingTenders?.map((t) => t.source_url) || []
    );

    // 4. Neue Items filtern (nicht in DB)
    const newItems = feed.items.filter(
      (item: RSSItem) => item.link && !existingUrls.has(item.link)
    );

    const skippedCount = feed.items.length - newItems.length;

    // Maximal 10 neue Items verarbeiten
    const itemsToProcess = newItems.slice(0, MAX_NEW_ITEMS);

    if (itemsToProcess.length === 0) {
      return NextResponse.json({
        success: true,
        stats: {
          gefunden: feed.items.length,
          uebersprungen: skippedCount,
          analysiert: 0,
          verbleibend: 0,
        },
        message: "Keine neuen Ausschreibungen gefunden",
      });
    }

    // 5. Gemini AI initialisieren
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json(
        { success: false, error: "GEMINI_API_KEY nicht konfiguriert" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 6. Jedes neue Item analysieren und speichern
    const results = [];
    const errors = [];

    for (const item of itemsToProcess) {
      try {
        // Web-Scraping: Vollständigen Seiteninhalt abrufen
        const pageContent = await fetchPageContent(item.link!);

        const fullText = pageContent
          ? `TITEL: ${item.title || ""}\n\nVOLLSTÄNDIGER AUSSCHREIBUNGSTEXT:\n${pageContent}`
          : `TITEL: ${item.title || ""}\nBESCHREIBUNG: ${item.contentSnippet || item.content || ""}\nLINK: ${item.link || ""}`;

        const prompt = `Analysiere diesen VOLLSTÄNDIGEN Ausschreibungstext für einen Bauauftrag.

${fullText}

AUFGABEN:

1. **GELD/BUDGET:**
   - Suche nach konkreten Auftragswerten (€-Beträge, Summen).
   - Wenn KEINE Zahl im Text steht, schätze das Volumen anhand der Mengenbeschreibung:
     * Gering (kleine Reparaturen, Einzelaufträge): 5.000 - 25.000 €
     * Mittel (mittlere Projekte, Teilsanierungen): 25.000 - 100.000 €
     * Groß (Großprojekte, Neubauten, Jahresverträge): 100.000 - 500.000+ €
   - Markiere KLAR ob es ein exakter Wert oder eine Schätzung ist!

2. **TECHNISCHE ANFORDERUNGEN:**
   - Extrahiere alle technischen Bedingungen: Meisterpflicht, notwendige Maschinen, Zertifikate (ISO, etc.), Versicherungen, Referenzen, Qualifikationen.

3. **DETAILS:**
   - Ort/Stadt der Ausführung
   - Gewerk/Kategorie
   - Abgabefrist
   - Kurzbeschreibung (1-2 Sätze)

Antworte NUR mit einem validen JSON-Objekt:
{
  "budget": "Exakter Wert z.B. '150.000 €' ODER Schätzung z.B. 'ca. 50.000 - 100.000 € (geschätzt)'",
  "budget_is_estimate": true/false,
  "location": "Stadt/Ort",
  "category": "Gewerk (z.B. Dachdecker, Elektro, Tiefbau, Sanitär, Maler)",
  "deadline": "YYYY-MM-DD oder 'k.A.'",
  "description_short": "Professionelle Kurzbeschreibung in 1-2 Sätzen",
  "requirements": ["Meisterbrief erforderlich", "Haftpflichtversicherung min. 1 Mio €", "ISO 9001 Zertifizierung", "..."]
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // JSON aus der Antwort extrahieren
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error("Kein JSON in Gemini-Antwort gefunden:", responseText);
          errors.push({ url: item.link, error: "Kein JSON in Antwort" });
          continue;
        }

        const parsed: GeminiResult = JSON.parse(jsonMatch[0]);

        // Requirements als Array für die neue Spalte
        const requirementsArray = parsed.requirements || [];

        // In Datenbank speichern (requirements als separate Spalte)
        const { error: insertError } = await supabase.from("tenders").insert({
          title: item.title || "Unbekannt",
          description: parsed.description_short || null,
          location: parsed.location || null,
          budget: parsed.budget || null,
          deadline: parsed.deadline !== "k.A." ? parsed.deadline : null,
          category: parsed.category || null,
          source_url: item.link,
          published_at: item.pubDate
            ? new Date(item.pubDate).toISOString()
            : null,
          requirements: requirementsArray,
        });

        if (insertError) {
          console.error("Insert Error:", insertError);
          errors.push({ url: item.link, error: insertError.message });
          continue;
        }

        results.push({
          title: item.title,
          source_url: item.link,
          budget: parsed.budget,
          budget_is_estimate: parsed.budget_is_estimate || false,
          location: parsed.location,
          category: parsed.category,
          requirements: requirementsArray,
          scraped: !!pageContent,
        });
      } catch (parseError) {
        console.error("Fehler bei Item-Verarbeitung:", parseError);
        errors.push({
          url: item.link,
          error: parseError instanceof Error ? parseError.message : "Unbekannt",
        });
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        gefunden: feed.items.length,
        uebersprungen: skippedCount,
        analysiert: results.length,
        fehler: errors.length,
        verbleibend: newItems.length - itemsToProcess.length,
      },
      message: `${results.length} von ${newItems.length} neuen Einträgen analysiert (${skippedCount} bereits in DB)`,
      processed: results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Scanner Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 }
    );
  }
}
