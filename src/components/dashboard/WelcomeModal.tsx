"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Settings, ArrowRight, CheckCircle2 } from "lucide-react";

interface WelcomeModalProps {
  firstName?: string | null;
}

const ONBOARDING_KEY = "tendersniper_onboarding_complete";

export function WelcomeModal({ firstName }: WelcomeModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Check if onboarding is complete
    const isComplete = localStorage.getItem(ONBOARDING_KEY);
    if (!isComplete) {
      setIsOpen(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setIsOpen(false);
  };

  const handleGoToSettings = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setIsOpen(false);
    router.push("/dashboard/settings");
  };

  const displayName = firstName || "Handwerker";

  const steps = [
    {
      title: `Willkommen, ${displayName}! 🎉`,
      description:
        "TenderSniper findet die passenden öffentlichen Ausschreibungen für dich – automatisch und tagesaktuell.",
      icon: <Sparkles className="h-8 w-8 text-signal-orange" />,
    },
    {
      title: "Suchprofil einrichten",
      description:
        "Definiere deine Gewerke und deinen Einsatzort. Je präziser dein Profil, desto bessere Treffer bekommst du.",
      icon: <Settings className="h-8 w-8 text-tech-blue" />,
    },
    {
      title: "Los geht's!",
      description:
        "Wir zeigen dir passende Ausschreibungen. Du kannst dein Profil jederzeit in den Einstellungen anpassen.",
      icon: <CheckCircle2 className="h-8 w-8 text-emerald-400" />,
    },
  ];

  const currentStep = steps[step - 1];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg border-neutral-800 bg-card text-foreground">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-signal-orange/20 to-tech-blue/20 ring-1 ring-signal-orange/30">
            {currentStep.icon}
          </div>
          <DialogTitle className="text-xl">{currentStep.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 py-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all ${
                i + 1 === step
                  ? "bg-signal-orange w-6"
                  : i + 1 < step
                  ? "bg-signal-orange/50"
                  : "bg-neutral-700"
              }`}
            />
          ))}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {step < 3 ? (
            <>
              <Button
                variant="ghost"
                onClick={handleComplete}
                className="text-muted-foreground hover:text-foreground"
              >
                Überspringen
              </Button>
              <Button
                onClick={() => setStep(step + 1)}
                className="bg-signal-orange hover:bg-signal-orange-hover text-white"
              >
                Weiter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleComplete}
                className="border-neutral-700 hover:bg-neutral-800"
              >
                Später einrichten
              </Button>
              <Button
                onClick={handleGoToSettings}
                className="bg-signal-orange hover:bg-signal-orange-hover text-white"
              >
                <Settings className="mr-2 h-4 w-4" />
                Profil einrichten
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
