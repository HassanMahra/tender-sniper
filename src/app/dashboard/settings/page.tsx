import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { loadSettings } from "./actions";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  // Load existing settings
  const settings = await loadSettings();

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Such-Profil bearbeiten
        </h1>
        <p className="mt-2 text-muted-foreground">
          Lege fest, welche Aufträge wir für dich finden sollen.
        </p>
      </header>

      {/* Settings Form */}
      <SettingsForm
        initialKeywords={settings?.keywords || ""}
        initialLocation={settings?.location || ""}
        initialRadius={settings?.radius || 50}
      />
    </div>
  );
}

