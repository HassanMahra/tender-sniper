import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { mapDbTenderToTender, type DbTender, type Tender } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  // Extract user metadata
  const firstName = user.user_metadata?.first_name || null;
  const lastName = user.user_metadata?.last_name || null;
  const companyName = user.user_metadata?.company_name || null;
  const email = user.email || "";

  // Get user settings (search profile)
  const { data: userSettings } = await supabase
    .from("user_settings")
    .select("keywords, location, radius")
    .eq("user_id", user.id)
    .single();

  // Build query for tenders
  let tenders: Tender[] = [];
  let totalCount = 0;

  try {
    // Parse keywords from user settings
    const keywords = userSettings?.keywords
      ? userSettings.keywords.split(",").map((k: string) => k.trim().toLowerCase()).filter(Boolean)
      : [];

    console.log("🔍 [Dashboard] User keywords:", keywords);
    console.log("🔍 [Dashboard] User location:", userSettings?.location);

    if (keywords.length > 0) {
      // Build OR conditions for keyword matching
      // Search in title, description, and category
      const orConditions = keywords
        .map((keyword: string) => 
          `title.ilike.%${keyword}%,description.ilike.%${keyword}%,category.ilike.%${keyword}%`
        )
        .join(",");

      const { data: matchedTenders, error, count } = await supabase
        .from("tenders")
        .select("*", { count: "exact" })
        .or(orConditions)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.log("🔍 [Dashboard] Query error:", error.message);
      } else {
        console.log("🔍 [Dashboard] Found", matchedTenders?.length, "matching tenders");
        tenders = (matchedTenders || []).map((t: DbTender) => ({
          ...mapDbTenderToTender(t),
          matchScore: calculateMatchScore(t, keywords),
        }));
        totalCount = count || 0;
      }
    } else {
      // No keywords - show latest tenders
      const { data: latestTenders, error, count } = await supabase
        .from("tenders")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.log("🔍 [Dashboard] Query error:", error.message);
      } else {
        console.log("🔍 [Dashboard] Showing latest", latestTenders?.length, "tenders");
        tenders = (latestTenders || []).map((t: DbTender) => mapDbTenderToTender(t));
        totalCount = count || 0;
      }
    }
  } catch (error) {
    console.log("🔍 [Dashboard] Error fetching tenders:", error);
  }

  // Sort by match score if available
  tenders.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  return (
    <DashboardContent
      firstName={firstName}
      lastName={lastName}
      companyName={companyName}
      email={email}
      tenders={tenders}
      totalCount={totalCount}
      hasKeywords={!!userSettings?.keywords}
    />
  );
}

/**
 * Calculate match score based on keyword matches
 */
function calculateMatchScore(tender: DbTender, keywords: string[]): number {
  if (keywords.length === 0) return 50;

  let matches = 0;
  const searchText = `${tender.title} ${tender.description || ""} ${tender.category || ""}`.toLowerCase();

  for (const keyword of keywords) {
    if (searchText.includes(keyword.toLowerCase())) {
      matches++;
    }
  }

  // Base score 60, +10 for each keyword match, max 98
  const score = Math.min(60 + (matches / keywords.length) * 38, 98);
  return Math.round(score);
}
