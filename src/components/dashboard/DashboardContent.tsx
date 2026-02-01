"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TenderCard } from "@/components/dashboard/TenderCard";
import { Search, SlidersHorizontal, TrendingUp, Clock, Zap, Building2, FileSearch, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Tender } from "@/types/database";

interface DashboardContentProps {
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  email: string;
  tenders?: Tender[]; // Made optional as we fetch internally
  totalCount?: number;
  hasKeywords: boolean;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

function calculateTotalBudget(tenders: Tender[]): string {
  const total = tenders.reduce((sum, t) => {
    const budgetStr = t.budget?.replace(/[^0-9]/g, "") || "0";
    return sum + (parseInt(budgetStr) || 0);
  }, 0);
  return total.toLocaleString("de-DE");
}

function EmptyState({ hasKeywords }: { hasKeywords: boolean }) {
  return (
    <Card className="border-neutral-800 bg-card">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-signal-orange/10">
          <FileSearch className="h-8 w-8 text-signal-orange" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          {hasKeywords
            ? "Keine passenden Aufträge gefunden"
            : "Dein Suchprofil ist noch leer"}
        </h3>
        <p className="mt-2 max-w-md text-muted-foreground">
          {hasKeywords
            ? "Versuche andere Suchbegriffe oder erweitere deinen Radius in den Einstellungen."
            : "Richte zuerst dein Suchprofil ein, damit wir passende Ausschreibungen für dich finden können."}
        </p>
        <Button asChild className="mt-6 bg-signal-orange hover:bg-signal-orange-hover text-white">
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            {hasKeywords ? "Suchprofil anpassen" : "Suchprofil einrichten"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function DashboardContent({
  firstName,
  lastName,
  companyName,
  email,
  tenders: initialTenders = [],
  totalCount: initialTotalCount = 0,
  hasKeywords,
}: DashboardContentProps) {
  const router = useRouter();
  const [tenders, setTenders] = useState<Tender[]>(initialTenders);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isLoading, setIsLoading] = useState(true);

  // Use firstName if available, otherwise extract from email or use fallback
  const displayName = firstName || email.split("@")[0] || "Handwerker";
  const greeting = getGreeting();

  useEffect(() => {
    async function fetchTenders() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/tenders');
        if (!res.ok) throw new Error('Failed to fetch tenders');
        const data = await res.json();
        setTenders(data.tenders || []);
        setTotalCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching tenders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTenders();
  }, []);

  // Calculate stats
  const topMatches = tenders.filter((t) => (t.matchScore || 0) >= 90).length;
  const totalBudget = calculateTotalBudget(tenders);

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/tenders/${id}`);
  };

  const handleApply = (id: string) => {
    router.push(`/dashboard/tenders/${id}?action=apply`);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {greeting}, {displayName}! 👋
            </h1>
            {companyName && (
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-neutral-700 text-muted-foreground"
                >
                  <Building2 className="mr-1.5 h-3 w-3" />
                  {companyName}
                </Badge>
              </div>
            )}
            <p className="mt-2 text-muted-foreground">
              {tenders.length > 0
                ? "Hier sind deine neuesten Ausschreibungen, die zu deinem Profil passen."
                : "Richte dein Suchprofil ein, um passende Aufträge zu finden."}
            </p>
          </div>

          {/* Quick Stats Badge */}
          {tenders.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-card border border-neutral-800 px-4 py-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-foreground">
                  {tenders.length} neue Treffer
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Suche nach Titel, Ort oder Gewerk..."
            className="h-10 w-full rounded-lg border border-neutral-800 bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-signal-orange focus:outline-none focus:ring-1 focus:ring-signal-orange"
          />
        </div>

        {/* Filter Button */}
        <Button
          variant="outline"
          className="border-neutral-700 hover:bg-secondary hover:border-neutral-600"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-signal-orange/10">
              <Zap className="h-5 w-5 text-signal-orange" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalCount}</p>
              <p className="text-sm text-muted-foreground">Passende Aufträge</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{topMatches}</p>
              <p className="text-sm text-muted-foreground">Top-Matches (90%+)</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tech-blue/10">
              <Clock className="h-5 w-5 text-tech-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {totalBudget} €
              </p>
              <p className="text-sm text-muted-foreground">Gesamtvolumen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-signal-orange" />
        </div>
      ) : tenders.length > 0 ? (
        <>
          {/* Section Title */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Aktuelle Chancen für dich ({tenders.length})
            </h2>
            <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground">
              Alle anzeigen
            </Button>
          </div>

          {/* Tender Cards List */}
          <div className="space-y-4">
            {tenders.map((tender) => (
              <TenderCard
                key={tender.id}
                tender={{
                  id: tender.id,
                  title: tender.title,
                  location: tender.location,
                  budget: tender.budget,
                  matchScore: tender.matchScore || 50,
                  deadline: tender.deadline,
                  category: tender.category,
                  description: tender.description || undefined,
                }}
                onViewDetails={handleViewDetails}
                onApply={handleApply}
              />
            ))}
          </div>

          {/* Load More */}
          {totalCount > tenders.length && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                className="border-neutral-700 hover:bg-secondary hover:border-neutral-600"
              >
                Mehr laden ({totalCount - tenders.length} weitere)
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState hasKeywords={hasKeywords} />
      )}
    </div>
  );
}
