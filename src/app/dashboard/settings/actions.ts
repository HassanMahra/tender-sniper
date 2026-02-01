"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface SettingsResult {
  success?: boolean;
  error?: string;
}

export interface UserSettings {
  id?: string;
  user_id: string;
  keywords: string | null;
  location: string | null;
  radius: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Load user settings from database
 */
export async function loadSettings(): Promise<UserSettings | null> {
  console.log("⚙️ [loadSettings] Loading user settings...");

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log("⚙️ [loadSettings] ❌ Not authenticated");
    return null;
  }

  console.log("⚙️ [loadSettings] User ID:", user.id);

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    // PGRST116 = no rows returned, which is fine for new users
    if (error.code === "PGRST116") {
      console.log("⚙️ [loadSettings] No settings found, returning defaults");
      return {
        user_id: user.id,
        keywords: null,
        location: null,
        radius: 50,
      };
    }
    console.log("⚙️ [loadSettings] ❌ Error:", error.message);
    return null;
  }

  console.log("⚙️ [loadSettings] ✅ Settings loaded:", data);
  return data as UserSettings;
}

/**
 * Save user settings to database (upsert)
 */
export async function saveSettings(formData: FormData): Promise<SettingsResult> {
  console.log("⚙️ [saveSettings] Saving user settings...");

  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log("⚙️ [saveSettings] ❌ Not authenticated");
    return { error: "Du musst angemeldet sein." };
  }

  console.log("⚙️ [saveSettings] User ID:", user.id);

  // Extract form data
  const keywords = formData.get("keywords") as string | null;
  const location = formData.get("location") as string | null;
  const radiusStr = formData.get("radius") as string;
  const radius = parseInt(radiusStr) || 50;

  console.log("⚙️ [saveSettings] Keywords:", keywords);
  console.log("⚙️ [saveSettings] Location:", location);
  console.log("⚙️ [saveSettings] Radius:", radius);

  // Upsert settings
  const { error } = await supabase.from("user_settings").upsert(
    {
      user_id: user.id,
      keywords: keywords?.trim() || null,
      location: location?.trim() || null,
      radius: radius,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id",
    }
  );

  if (error) {
    console.log("⚙️ [saveSettings] ❌ Error:", error.message);
    console.log("⚙️ [saveSettings] Error code:", error.code);
    console.log("⚙️ [saveSettings] Full error:", JSON.stringify(error, null, 2));
    return { error: `Fehler beim Speichern: ${error.message}` };
  }

  console.log("⚙️ [saveSettings] ✅ Settings saved successfully");

  revalidatePath("/dashboard/settings");

  return { success: true };
}

