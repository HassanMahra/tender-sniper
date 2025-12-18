"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export interface AuthResult {
  error?: string;
  success?: boolean;
}

/**
 * Sign in with email and password
 */
export async function signIn(formData: FormData): Promise<AuthResult> {
  console.log("🔐 [signIn] Starting login process...");

  const supabase = await createClient();
  console.log("🔐 [signIn] Supabase client created");

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  console.log("🔐 [signIn] Attempting login for email:", data.email);

  // Validate inputs
  if (!data.email || !data.password) {
    console.log("🔐 [signIn] ❌ Validation failed: missing email or password");
    return { error: "Bitte fülle alle Felder aus." };
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data);

  console.log("🔐 [signIn] Auth response received");
  console.log("🔐 [signIn] Auth data:", JSON.stringify(authData, null, 2));

  if (error) {
    console.log("🔐 [signIn] ❌ ERROR occurred:");
    console.log("🔐 [signIn] Error message:", error.message);
    console.log("🔐 [signIn] Error code:", error.code);
    console.log("🔐 [signIn] Error status:", error.status);
    console.log("🔐 [signIn] Full error object:", JSON.stringify(error, null, 2));

    // Return the actual error message from Supabase
    return { error: `[${error.code || "UNKNOWN"}] ${error.message}` };
  }

  console.log("🔐 [signIn] ✅ Login successful for:", data.email);
  console.log("🔐 [signIn] User ID:", authData?.user?.id);

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Sign up with email and password
 */
export async function signUp(formData: FormData): Promise<AuthResult> {
  console.log("📝 [signUp] Starting registration process...");

  const supabase = await createClient();
  console.log("📝 [signUp] Supabase client created");

  // Log environment variables (without exposing full keys)
  console.log("📝 [signUp] SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("📝 [signUp] ANON_KEY exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log("📝 [signUp] SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL);

  // Extract form data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const companyName = formData.get("company_name") as string | null;

  console.log("📝 [signUp] Attempting signup for email:", email);
  console.log("📝 [signUp] First name:", firstName);
  console.log("📝 [signUp] Last name:", lastName);
  console.log("📝 [signUp] Company:", companyName || "(not provided)");

  // Validate inputs
  if (!email || !password) {
    console.log("📝 [signUp] ❌ Validation failed: missing email or password");
    return { error: "Bitte fülle alle Felder aus." };
  }

  if (!firstName || !lastName) {
    console.log("📝 [signUp] ❌ Validation failed: missing name fields");
    return { error: "Bitte gib deinen Vor- und Nachnamen an." };
  }

  if (password.length < 6) {
    console.log("📝 [signUp] ❌ Validation failed: password too short");
    return { error: "Das Passwort muss mindestens 6 Zeichen haben." };
  }

  console.log("📝 [signUp] Calling supabase.auth.signUp with metadata...");

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
        company_name: companyName || null,
      },
    },
  });

  console.log("📝 [signUp] Auth response received");
  console.log("📝 [signUp] Auth data:", JSON.stringify(authData, null, 2));

  if (error) {
    console.log("📝 [signUp] ❌ ERROR occurred:");
    console.log("📝 [signUp] Error message:", error.message);
    console.log("📝 [signUp] Error code:", error.code);
    console.log("📝 [signUp] Error status:", error.status);
    console.log("📝 [signUp] Error name:", error.name);
    console.log("📝 [signUp] Full error object:", JSON.stringify(error, null, 2));

    // Return the actual error message from Supabase
    return { error: `[${error.code || "UNKNOWN"}] ${error.message}` };
  }

  console.log("📝 [signUp] ✅ Signup successful");
  console.log("📝 [signUp] User ID:", authData?.user?.id);
  console.log("📝 [signUp] User email:", authData?.user?.email);
  console.log("📝 [signUp] User metadata:", authData?.user?.user_metadata);

  return {
    success: true,
  };
}

/**
 * Sign out the current user
 */
export async function signOut() {
  console.log("🚪 [signOut] Starting logout process...");

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log("🚪 [signOut] ❌ Error:", error.message);
  } else {
    console.log("🚪 [signOut] ✅ Logout successful");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
