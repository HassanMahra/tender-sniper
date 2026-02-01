import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * Auth callback route for handling email confirmation and OAuth redirects
 * Supabase redirects here after email verification or OAuth login
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  console.log("🔄 [auth/callback] Received callback request");
  console.log("🔄 [auth/callback] Code present:", !!code);
  console.log("🔄 [auth/callback] Redirect target:", next);

  if (code) {
    const supabase = await createClient();

    console.log("🔄 [auth/callback] Exchanging code for session...");

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.log("🔄 [auth/callback] ❌ Error exchanging code:");
      console.log("🔄 [auth/callback] Error message:", error.message);
      console.log("🔄 [auth/callback] Error code:", error.code);

      // Redirect to login with error message
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`
      );
    }

    console.log("🔄 [auth/callback] ✅ Session created successfully");
    console.log("🔄 [auth/callback] User ID:", data.user?.id);
    console.log("🔄 [auth/callback] User email:", data.user?.email);

    // Redirect to the target page (default: dashboard)
    return NextResponse.redirect(`${origin}${next}`);
  }

  console.log("🔄 [auth/callback] ❌ No code provided, redirecting to login");

  // No code provided, redirect to login
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}

