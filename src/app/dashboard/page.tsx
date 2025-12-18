import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default async function DashboardPage() {
  const supabase = await createClient();

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

  return (
    <DashboardContent
      firstName={firstName}
      lastName={lastName}
      companyName={companyName}
      email={email}
    />
  );
}
