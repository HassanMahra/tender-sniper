"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationDialog } from "@/components/dashboard/ApplicationDialog";
import type { Tender } from "@/types/database";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Euro,
  Download,
  Send,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";

interface UserInfo {
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  email: string;
}

interface TenderDetailContentProps {
  tender: Tender | null;
  user: UserInfo;
}

/**
 * Formats a date string to German locale
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Returns score color class based on match score
 */
function getScoreColor(score: number): string {
  if (score >= 90) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (score >= 70) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
}

/**
 * Calculate days until deadline
 */
function getDaysUntilDeadline(dateString: string): number {
  try {
    const deadline = new Date(dateString);
    if (isNaN(deadline.getTime())) return 30;
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch {
    return 30;
  }
}

// Mock requirements for demo
const mockRequirements = [
  { text: "Meisterbrief oder gleichwertige Qualifikation", required: true },
  { text: "Mind. 3 Referenzprojekte aus den letzten 2 Jahren", required: true },
  { text: "Nachweis Betriebshaftpflicht (min. 2 Mio. €)", required: true },
  { text: "Präqualifikation im AVPQ oder ULV", required: false },
  { text: "ISO 9001 Zertifizierung", required: false },
];

/**
 * 404 Component for tender not found
 */
function TenderNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-signal-orange/10">
        <AlertCircle className="h-10 w-10 text-signal-orange" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">
        Ausschreibung nicht gefunden
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Die gesuchte Ausschreibung existiert nicht oder wurde bereits entfernt.
      </p>
      <Button asChild className="mt-6" variant="outline">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zum Dashboard
        </Link>
      </Button>
    </div>
  );
}

export function TenderDetailContent({ tender, user }: TenderDetailContentProps) {
  const router = useRouter();
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);

  // Show 404 if tender not found
  if (!tender) {
    return <TenderNotFound />;
  }

  const daysLeft = getDaysUntilDeadline(tender.deadline);
  const matchScore = tender.matchScore || 50;

  return (
    <>
      {/* Application Dialog */}
      <ApplicationDialog
        open={applicationDialogOpen}
        onOpenChange={setApplicationDialogOpen}
        tenderTitle={tender.title}
        tenderLocation={tender.location}
        tenderCategory={tender.category}
        user={user}
      />
      <div className="p-6 lg:p-8">
        {/* Header */}
        <header className="mb-8">
          {/* Back Button & Title Row */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück
              </Button>

              {/* Title */}
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                {tender.title}
              </h1>

              {/* Category & Source */}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {tender.category}
                </span>
                <span className="text-neutral-600">•</span>
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  Quelle: bund.de
                </span>
              </div>
            </div>

            {/* Right Side: Badge & Deadline */}
            <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
              <Badge
                variant="outline"
                className={cn(
                  "text-sm font-semibold tabular-nums px-3 py-1",
                  getScoreColor(matchScore)
                )}
              >
                {matchScore}% Match
              </Badge>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium",
                  daysLeft <= 7
                    ? "bg-red-500/10 text-red-400"
                    : daysLeft <= 14
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-neutral-800 text-muted-foreground"
                )}
              >
                <Clock className="h-4 w-4" />
                {daysLeft > 0 ? `Noch ${daysLeft} Tage` : "Abgelaufen"}
              </div>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content (2/3) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Summary Card */}
            <Card className="border-neutral-800 bg-card">
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Zusammenfassung
                </h2>
              </CardHeader>
              <CardContent>
                {tender.description ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {tender.description}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-secondary/50 p-4 border border-neutral-800">
                    <p className="text-sm text-muted-foreground">
                      Keine detaillierte Beschreibung verfügbar. Bitte lade die Original-Ausschreibung herunter.
                    </p>
                  </div>
                )}

                {/* External link info */}
                {tender.source_url && (
                  <div className="mt-4 rounded-lg bg-secondary/50 p-4 border border-neutral-800">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Original-Quelle:{" "}
                      </span>
                      <a 
                        href={tender.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-tech-blue hover:underline"
                      >
                        Ausschreibung auf bund.de öffnen
                      </a>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Requirements Card */}
            <Card className="border-neutral-800 bg-card">
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Typische Anforderungen
                </h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {mockRequirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2
                        className={cn(
                          "mt-0.5 h-5 w-5 shrink-0",
                          req.required ? "text-signal-orange" : "text-neutral-600"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm",
                          req.required
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {req.text}
                        {req.required && (
                          <span className="ml-2 text-xs text-signal-orange">
                            Pflicht
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">
                  * Dies sind typische Anforderungen für öffentliche Ausschreibungen. 
                  Bitte prüfe die genauen Anforderungen in der Original-Ausschreibung.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Key Facts Card */}
            <Card className="border-neutral-800 bg-card">
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Key Facts
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Budget */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-signal-orange/10">
                    <Euro className="h-5 w-5 text-signal-orange" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p
                      className={cn(
                        "font-semibold",
                        tender.budget === "k.A."
                          ? "text-muted-foreground"
                          : "text-foreground"
                      )}
                    >
                      {tender.budget}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tech-blue/10">
                    <MapPin className="h-5 w-5 text-tech-blue" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Standort</p>
                    <p className="font-semibold text-foreground">
                      {tender.location}
                    </p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Calendar className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Bewerbungsfrist
                    </p>
                    <p className="font-semibold text-foreground">
                      {formatDate(tender.deadline)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Card */}
            <Card className="border-neutral-800 bg-card">
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold text-foreground">Aktion</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Apply Button */}
                <Button
                  className="w-full bg-signal-orange hover:bg-signal-orange-hover text-white shadow-lg shadow-signal-orange/20"
                  size="lg"
                  onClick={() => setApplicationDialogOpen(true)}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Jetzt bewerben
                </Button>

                {/* Download Button */}
                <Button
                  variant="outline"
                  className="w-full border-neutral-700 hover:bg-secondary hover:border-neutral-600"
                  size="lg"
                  asChild={tender.source_url ? true : false}
                >
                  {tender.source_url ? (
                    <a href={tender.source_url} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Ausschreibung herunterladen
                    </a>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Ausschreibung herunterladen
                    </>
                  )}
                </Button>

                {/* External Link */}
                {tender.source_url && (
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-foreground"
                    size="sm"
                    asChild
                  >
                    <a href={tender.source_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Auf bund.de öffnen
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Info Box */}
            <div className="rounded-lg border border-neutral-800 bg-secondary/30 p-4">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Hinweis:</span> Diese
                Zusammenfassung wurde automatisch von unserer KI erstellt. Bitte
                prüfe die Originalausschreibung vor der Bewerbung.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
