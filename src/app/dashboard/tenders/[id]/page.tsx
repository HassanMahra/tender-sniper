import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { TenderDetailContent } from "@/components/dashboard/TenderDetailContent";
import { mapDbTenderToTender, type DbTender } from "@/types/database";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TenderDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  // Fetch tender from database
  let tender = null;
  try {
    const { data, error } = await supabase
      .from("tenders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log("🔍 [TenderDetail] Error fetching tender:", error.message);
    } else if (data) {
      tender = mapDbTenderToTender(data as DbTender);
    }
  } catch (error) {
    console.log("🔍 [TenderDetail] Error:", error);
  }

  // Extract user metadata
  const userData = {
    firstName: user.user_metadata?.first_name || null,
    lastName: user.user_metadata?.last_name || null,
    companyName: user.user_metadata?.company_name || null,
    email: user.email || "",
  };

  return (
    <TenderDetailContent 
      tender={tender}
      user={userData}
    />
  );
}
