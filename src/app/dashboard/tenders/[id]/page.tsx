import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { TenderDetailContent } from "@/components/dashboard/TenderDetailContent";
import { mockTenders } from "@/lib/mock-data";

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

  // Find tender by ID
  const tender = mockTenders.find((t) => t.id === id);

  // Extract user metadata
  const userData = {
    firstName: user.user_metadata?.first_name || null,
    lastName: user.user_metadata?.last_name || null,
    companyName: user.user_metadata?.company_name || null,
    email: user.email || "",
  };

  return (
    <TenderDetailContent 
      tender={tender || null}
      user={userData}
    />
  );
}
