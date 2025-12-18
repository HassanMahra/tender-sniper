import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  // Extract user metadata for sidebar
  const firstName = user.user_metadata?.first_name || null;
  const lastName = user.user_metadata?.last_name || null;
  const companyName = user.user_metadata?.company_name || null;
  const email = user.email || "";

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar with user data */}
      <Sidebar
        firstName={firstName}
        lastName={lastName}
        companyName={companyName}
        email={email}
      />

      {/* Main Content Area */}
      <div className="pl-64">
        <main className="min-h-screen">{children}</main>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#111111",
            border: "1px solid #262626",
            color: "#EDEDED",
          },
        }}
      />
    </div>
  );
}
