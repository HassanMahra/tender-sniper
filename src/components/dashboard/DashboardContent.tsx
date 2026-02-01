"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { TenderCard } from "@/components/dashboard/TenderCard";
import { WelcomeModal } from "@/components/dashboard/WelcomeModal";
import { Search, SlidersHorizontal, TrendingUp, Clock, Zap, Building2, FileSearch, Settings, Loader2, ListFilter, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TenderDetailContent } from "@/components/dashboard/TenderDetailContent";
import type { Tender } from "@/types/database";
import { toast } from "sonner";

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

interface EmptyStateProps {
  hasKeywords: boolean;
  viewMode: "matches" | "all";
  onSwitchToAll: () => void;
}

function EmptyState({ hasKeywords, viewMode, onSwitchToAll }: EmptyStateProps) {
  return (
    <Card className="border-neutral-800 bg-card">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-signal-orange/10">
          <FileSearch className="h-8 w-8 text-signal-orange" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          {!hasKeywords
            ? "Dein Suchprofil ist noch leer"
            : viewMode === "matches"
            ? "Keine passenden Aufträge gefunden"
            : "Keine Ausschreibungen vorhanden"}
        </h3>
        <p className="mt-2 max-w-md text-muted-foreground">
          {!hasKeywords
            ? "Richte zuerst dein Suchprofil ein, damit wir passende Ausschreibungen für dich finden können."
            : viewMode === "matches"
            ? "Versuche andere Suchbegriffe oder schau dir alle verfügbaren Ausschreibungen an."
            : "Aktuell sind keine Ausschreibungen in der Datenbank vorhanden."}
        </p>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button asChild className="bg-signal-orange hover:bg-signal-orange-hover text-white">
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              {hasKeywords ? "Suchprofil anpassen" : "Suchprofil einrichten"}
            </Link>
          </Button>
          
          {hasKeywords && viewMode === "matches" && (
            <Button
              variant="outline"
              className="border-neutral-700 hover:bg-neutral-800"
              onClick={onSwitchToAll}
            >
              <Layers className="mr-2 h-4 w-4" />
              Alle Ausschreibungen zeigen
            </Button>
          )}
        </div>
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"matches" | "all">("matches");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tenderToDelete, setTenderToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use firstName if available, otherwise extract from email or use fallback
  const displayName = firstName || email.split("@")[0] || "Handwerker";
  const greeting = getGreeting();
  
  const isFirstMount = useRef(true);

  const fetchTenders = async (pageNum: number, append: boolean = false, mode: "matches" | "all" = viewMode) => {
    try {
      if (!append) setIsLoading(true);
      const params = new URLSearchParams();
      params.append('page', pageNum.toString());
      params.append('limit', LIMIT.toString());
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (mode === 'all') {
        params.append('showAll', 'true');
      }
      
      const res = await fetch(`/api/tenders?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch tenders');
      const data = await res.json();
      
      if (append) {
        setTenders(prev => [...prev, ...(data.tenders || [])]);
      } else {
        setTenders(data.tenders || []);
      }
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching tenders:", error);
      toast.error("Fehler beim Laden der Ausschreibungen");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setPage(1);
    fetchTenders(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, viewMode]);

  const handleViewModeChange = (mode: "matches" | "all") => {
    setViewMode(mode);
    setPage(1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTenders(nextPage, true);
  };

  // Calculate stats
  const topMatches = tenders.filter((t) => (t.matchScore || 0) >= 90).length;
  const totalBudget = calculateTotalBudget(tenders);

  const handleViewDetails = (id: string) => {
    const tender = tenders.find(t => t.id === id);
    if (tender) {
      setSelectedTender(tender);
      setIsDetailOpen(true);
    } else {
       // Fallback to route if not found in current list (should not happen in this view)
       router.push(`/dashboard/tenders/${id}`);
    }
  };

  const handleApply = (id: string) => {
    router.push(`/dashboard/tenders/${id}?action=apply`);
  };

  const openDeleteConfirm = (id: string) => {
    setTenderToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!tenderToDelete) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/tenders/${tenderToDelete}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete tender');
      }

      setTenders((prev) => prev.filter((t) => t.id !== tenderToDelete));
      setTotalCount((prev) => prev - 1);
      toast.success("Ausschreibung erfolgreich gelöscht");
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting tender:", error);
      toast.error("Fehler beim Löschen der Ausschreibung");
    } finally {
      setIsDeleting(false);
      setTenderToDelete(null);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome Modal for new users */}
      <WelcomeModal firstName={firstName} />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md border-neutral-800 bg-card text-foreground">
          <DialogHeader>
            <DialogTitle>Ausschreibung löschen?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Möchtest du diese Ausschreibung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" className="border-neutral-700 hover:bg-neutral-800">
                Abbrechen
              </Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={executeDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto p-0 border-neutral-800 bg-background">
          {selectedTender && (
             <TenderDetailContent 
               tender={selectedTender} 
               user={{ firstName, lastName, companyName, email }}
               isModal={true}
               onDelete={openDeleteConfirm}
             />
          )}
        </DialogContent>
      </Dialog>

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
                ? viewMode === "matches"
                  ? "Hier sind deine neuesten Ausschreibungen, die zu deinem Profil passen."
                  : "Alle verfügbaren Ausschreibungen in deinem Bereich."
                : "Richte dein Suchprofil ein, um passende Aufträge zu finden."}
            </p>
          </div>

          {/* Quick Stats Badge */}
          {tenders.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-card border border-neutral-800 px-4 py-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-foreground">
                  {tenders.length} {viewMode === "matches" ? "Treffer" : "Ausschreibungen"}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* View Mode Toggle & Filter Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* View Mode Toggle */}
        <div className="flex rounded-lg border border-neutral-800 bg-card p-1">
          <button
            onClick={() => handleViewModeChange("matches")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              viewMode === "matches"
                ? "bg-signal-orange text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListFilter className="h-4 w-4" />
            Meine Matches
          </button>
          <button
            onClick={() => handleViewModeChange("all")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              viewMode === "all"
                ? "bg-signal-orange text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-4 w-4" />
            Alle Ausschreibungen
          </button>
        </div>

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="border-neutral-700 hover:bg-secondary hover:border-neutral-600"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Status: {statusFilter === 'all' ? 'Alle' : 
                       statusFilter === 'new' ? 'Neu' : 
                       statusFilter === 'applied' ? 'Beworben' : 
                       statusFilter === 'interested' ? 'Interessiert' :
                       statusFilter === 'rejected' ? 'Abgelehnt' :
                       statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card border-neutral-800 text-foreground">
            <DropdownMenuLabel>Status filtern</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-neutral-800" />
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
              <DropdownMenuRadioItem value="all">Alle anzeigen</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="new">Neu</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="applied">Beworben</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="interested">Interessiert</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="rejected">Abgelehnt</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
              <p className="text-sm text-muted-foreground">
                {viewMode === "matches" ? "Passende Aufträge" : "Alle Aufträge"}
              </p>
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
      {isLoading && tenders.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-signal-orange" />
        </div>
      ) : tenders.length > 0 ? (
        <>
          {/* Section Title */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {viewMode === "matches" ? "Aktuelle Chancen für dich" : "Alle verfügbaren Ausschreibungen"} ({tenders.length} von {totalCount})
            </h2>
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
                onDelete={openDeleteConfirm}
              />
            ))}
          </div>

          {/* Load More */}
          {totalCount > tenders.length && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                className="border-neutral-700 hover:bg-secondary hover:border-neutral-600"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Mehr laden ({totalCount - tenders.length} weitere)
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState 
          hasKeywords={hasKeywords} 
          viewMode={viewMode}
          onSwitchToAll={() => handleViewModeChange("all")}
        />
      )}
    </div>
  );
}
