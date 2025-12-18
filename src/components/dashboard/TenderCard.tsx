"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Euro, ArrowRight, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tender } from "@/lib/mock-data";

interface TenderCardProps {
  tender: Tender;
  onViewDetails?: (id: string) => void;
  onApply?: (id: string) => void;
}

/**
 * Formats a date string to German locale
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Returns badge variant based on match score
 */
function getScoreVariant(score: number): "default" | "secondary" | "destructive" | "outline" {
  if (score >= 90) return "default";
  if (score >= 70) return "secondary";
  return "outline";
}

/**
 * Returns score color class based on match score
 */
function getScoreColor(score: number): string {
  if (score >= 90) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (score >= 70) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
}

export function TenderCard({ tender, onViewDetails, onApply }: TenderCardProps) {
  const { id, title, location, budget, matchScore, deadline, category } = tender;

  return (
    <Card className="group relative overflow-hidden bg-card border-neutral-800 hover:border-neutral-700 transition-all duration-200">
      {/* Subtle gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-signal-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between gap-4">
          {/* Title & Category */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-lg leading-tight truncate">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{category}</p>
          </div>

          {/* Match Score Badge */}
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 font-semibold tabular-nums",
              getScoreColor(matchScore)
            )}
          >
            {matchScore}% Match
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-tech-blue shrink-0" />
            <span className="text-muted-foreground truncate">{location}</span>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-tech-blue shrink-0" />
            <span className="text-muted-foreground">{formatDate(deadline)}</span>
          </div>

          {/* Budget */}
          <div className="flex items-center gap-2 text-sm">
            <Euro className="h-4 w-4 text-tech-blue shrink-0" />
            <span className={cn(
              "font-medium",
              budget === "k.A." ? "text-muted-foreground" : "text-foreground"
            )}>
              {budget}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative pt-0 justify-end gap-2">
        {/* Save Button (Icon only) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary mr-auto"
          aria-label="Speichern"
        >
          <Bookmark className="h-4 w-4" />
        </Button>

        {/* View Details Button */}
        <Button
          variant="outline"
          size="sm"
          className="border-neutral-700 hover:bg-secondary hover:border-neutral-600"
          onClick={() => onViewDetails?.(id)}
        >
          Details ansehen
        </Button>

        {/* Apply Button */}
        <Button
          size="sm"
          className="bg-signal-orange hover:bg-signal-orange-hover text-white shadow-lg shadow-signal-orange/20"
          onClick={() => onApply?.(id)}
        >
          Jetzt bewerben
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

