"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "../login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Crosshair, Mail, Lock, ArrowRight, Loader2, CheckCircle2, User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await signUp(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess("Bestätigungs-E-Mail gesendet! Bitte prüfe dein Postfach.");
      }
    } catch {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-signal-orange/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-tech-blue/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo */}
      <Link
        href="/"
        className="relative flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground mb-8"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-orange">
          <Crosshair className="h-6 w-6 text-white" />
        </div>
        <span>
          Tender<span className="text-signal-orange">Sniper</span>
        </span>
      </Link>

      {/* Signup Card */}
      <Card className="relative w-full max-w-md bg-card border-neutral-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Konto erstellen
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Registriere dich kostenlos für TenderSniper
          </CardDescription>
        </CardHeader>

        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400 flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                {success}
              </div>
            )}

            {/* Name Grid (2 columns) */}
            <div className="grid grid-cols-2 gap-3">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-foreground">
                  Vorname
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="Max"
                    required
                    disabled={isLoading}
                    className={cn(
                      "pl-10 bg-background border-neutral-800",
                      "focus:border-signal-orange focus:ring-signal-orange/20"
                    )}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-foreground">
                  Nachname
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Mustermann"
                  required
                  disabled={isLoading}
                  className={cn(
                    "bg-background border-neutral-800",
                    "focus:border-signal-orange focus:ring-signal-orange/20"
                  )}
                />
              </div>
            </div>

            {/* Company Name (Optional) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="company_name" className="text-foreground">
                  Firmenname
                </Label>
                <span className="text-xs text-muted-foreground">Optional</span>
              </div>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="company_name"
                  name="company_name"
                  type="text"
                  placeholder="Mustermann Bau GmbH"
                  disabled={isLoading}
                  className={cn(
                    "pl-10 bg-background border-neutral-800",
                    "focus:border-signal-orange focus:ring-signal-orange/20"
                  )}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                E-Mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="max@beispiel.de"
                  required
                  disabled={isLoading}
                  className={cn(
                    "pl-10 bg-background border-neutral-800",
                    "focus:border-signal-orange focus:ring-signal-orange/20"
                  )}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Passwort
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={isLoading}
                  className={cn(
                    "pl-10 bg-background border-neutral-800",
                    "focus:border-signal-orange focus:ring-signal-orange/20"
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Mindestens 6 Zeichen
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            {/* Primary Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-signal-orange hover:bg-signal-orange-hover text-white shadow-lg shadow-signal-orange/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrieren...
                </>
              ) : (
                <>
                  Kostenlos registrieren
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Login Link */}
            <Link
              href="/login"
              className="w-full"
            >
              <Button
                type="button"
                variant="outline"
                className="w-full border-neutral-700 hover:bg-secondary"
              >
                Schon ein Konto? Anmelden
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>

      {/* Footer */}
      <p className="relative mt-8 text-sm text-muted-foreground">
        Mit der Registrierung akzeptierst du unsere{" "}
        <Link href="/datenschutz" className="text-signal-orange hover:underline">
          Datenschutzerklärung
        </Link>{" "}
        und{" "}
        <Link href="/agb" className="text-signal-orange hover:underline">
          AGB
        </Link>
        .
      </p>
    </div>
  );
}
