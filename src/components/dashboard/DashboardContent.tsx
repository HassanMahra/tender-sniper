"use client";

import { useRouter } from "next/navigation";
import { TenderCard } from "@/components/dashboard/TenderCard";
import { mockTenders } from "@/lib/mock-data";
import { Search, SlidersHorizontal, TrendingUp, Clock, Zap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardContentProps {
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  email: string;
}

/**
 * Get greeting based on time of day
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

export function DashboardContent({
  firstName,
  lastName,
  companyName,
  email,
}: DashboardContentProps) {
  const router = useRouter();

  // Use firstName if available, otherwise extract from email or use fallback
  const displayName = firstName || email.split("@")[0] || "Handwerker";
  const greeting = getGreeting();

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
              Hier sind deine neuesten Ausschreibungen, die zu deinem Profil passen.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-card border border-neutral-800 px-4 py-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-foreground">
                {mockTenders.length} neue heute
              </span>
            </div>
          </div>
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
              <p className="text-2xl font-bold text-foreground">{mockTenders.length}</p>
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
              <p className="text-2xl font-bold text-foreground">
                {mockTenders.filter((t) => t.matchScore >= 90).length}
              </p>
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
                {mockTenders
                  .reduce((sum, t) => {
                    const budget = t.budget.replace(/[^0-9]/g, "");
                    return sum + (parseInt(budget) || 0);
                  }, 0)
                  .toLocaleString("de-DE")}{" "}
                €
              </p>
              <p className="text-sm text-muted-foreground">Gesamtvolumen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Aktuelle Chancen für dich ({mockTenders.length})
        </h2>
        <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground">
          Alle anzeigen
        </Button>
      </div>

      {/* Tender Cards List */}
      <div className="space-y-4">
        {mockTenders.map((tender) => (
          <TenderCard
            key={tender.id}
            tender={tender}
            onViewDetails={handleViewDetails}
            onApply={handleApply}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          className="border-neutral-700 hover:bg-secondary hover:border-neutral-600"
        >
          Mehr laden
        </Button>
      </div>
    </div>
  );
}

