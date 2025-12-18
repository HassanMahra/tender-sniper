"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Send, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserInfo {
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  email?: string;
}

interface ApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenderTitle: string;
  tenderLocation: string;
  tenderCategory: string;
  user?: UserInfo;
}

/**
 * Generates a professional application letter based on tender and user details
 */
function generateApplicationText(
  title: string,
  location: string,
  category: string,
  user?: UserInfo
): string {
  const fullName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : "[Dein Name]";
  
  const companyName = user?.companyName || "[Dein Firmenname]";
  const email = user?.email || "[deine@email.de]";

  return `Sehr geehrte Damen und Herren,

mit großem Interesse haben wir Ihre Ausschreibung für "${title}" zur Kenntnis genommen. Als spezialisierter Fachbetrieb im Bereich ${category} sind wir überzeugt, der ideale Partner für dieses Projekt zu sein.

${companyName !== "[Dein Firmenname]" ? companyName : "Unser Unternehmen"} verfügt über ein Team qualifizierter Fachkräfte mit langjähriger Berufserfahrung. In den vergangenen Jahren haben wir erfolgreich vergleichbare Projekte für öffentliche Auftraggeber realisiert.

Unsere Kernkompetenzen umfassen:
• Termingerechte Projektabwicklung mit digitaler Baustellendokumentation
• Zertifiziertes Qualitätsmanagement
• Nachhaltige Bauweise mit Fokus auf energieeffiziente Lösungen
• Erfahrung mit VOB/B-konformer Abwicklung öffentlicher Aufträge

Wir verfügen über alle erforderlichen Qualifikationen sowie eine umfassende Betriebshaftpflichtversicherung.

Gerne stellen wir Ihnen auf Anfrage Referenzlisten und Projektdokumentationen zur Verfügung. Für ein persönliches Gespräch oder eine Ortsbesichtigung stehen wir jederzeit zur Verfügung.

Mit freundlichen Grüßen,

${fullName}
${companyName !== "[Dein Firmenname]" ? `Geschäftsführer\n${companyName}` : ""}
E-Mail: ${email}`;
}

export function ApplicationDialog({
  open,
  onOpenChange,
  tenderTitle,
  tenderLocation,
  tenderCategory,
  user,
}: ApplicationDialogProps) {
  const [applicationText, setApplicationText] = useState(() =>
    generateApplicationText(tenderTitle, tenderLocation, tenderCategory, user)
  );
  const [isSending, setIsSending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Update text when tender changes
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setApplicationText(
        generateApplicationText(tenderTitle, tenderLocation, tenderCategory, user)
      );
      setIsCopied(false);
    }
    onOpenChange(isOpen);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(applicationText);
      setIsCopied(true);
      toast.success("In Zwischenablage kopiert", {
        description: "Der Text wurde erfolgreich kopiert.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Kopieren fehlgeschlagen", {
        description: "Bitte versuche es erneut.",
      });
    }
  };

  const handleSubmit = async () => {
    setIsSending(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSending(false);
    onOpenChange(false);

    toast.success("Erfolgreich beworben! 🎉", {
      description: `Deine Bewerbung für "${tenderTitle}" wurde übermittelt.`,
      duration: 5000,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-w-2xl bg-card border-neutral-800",
          "max-h-[85vh] flex flex-col"
        )}
      >
        {/* Fixed Header */}
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5 text-signal-orange" />
            Bewerbung erstellen
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            für{" "}
            <span className="font-medium text-foreground">{tenderTitle}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
          {/* AI Hint */}
          <div className="flex items-start gap-3 rounded-lg bg-signal-orange/10 border border-signal-orange/20 p-3">
            <Sparkles className="h-5 w-5 text-signal-orange shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">KI-Entwurf: </span>
              Unsere KI hat diesen Text basierend auf deinem Firmenprofil und den
              Anforderungen der Ausschreibung erstellt. Du kannst ihn beliebig
              anpassen.
            </p>
          </div>

          {/* Textarea */}
          <div className="relative">
            <Textarea
              value={applicationText}
              onChange={(e) => setApplicationText(e.target.value)}
              className={cn(
                "min-h-[250px] h-[250px] resize-none",
                "bg-background border-neutral-800",
                "font-mono text-sm leading-relaxed",
                "focus:border-signal-orange focus:ring-signal-orange/20",
                "placeholder:text-muted-foreground"
              )}
              placeholder="Dein Bewerbungstext..."
            />
            {/* Character count */}
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-1 rounded">
              {applicationText.length} Zeichen
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="shrink-0 flex-col sm:flex-row gap-2 pt-4 border-t border-neutral-800 mt-4">
          {/* Copy Button */}
          <Button
            variant="ghost"
            onClick={handleCopyToClipboard}
            className="text-muted-foreground hover:text-foreground sm:mr-auto"
          >
            {isCopied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-emerald-400" />
                Kopiert!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                In Zwischenablage kopieren
              </>
            )}
          </Button>

          {/* Cancel Button */}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-neutral-700 hover:bg-secondary"
            disabled={isSending}
          >
            Abbrechen
          </Button>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSending || applicationText.trim().length === 0}
            className="bg-signal-orange hover:bg-signal-orange-hover text-white shadow-lg shadow-signal-orange/20 min-w-[120px]"
          >
            {isSending ? (
              <>
                <span className="animate-pulse">Senden...</span>
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Absenden
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
