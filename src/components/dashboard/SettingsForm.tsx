"use client";

import { useState } from "react";
import { saveSettings } from "@/app/dashboard/settings/actions";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MapPin, Search, Loader2, Save, Tag, CheckCircle2, Plus } from "lucide-react";

interface SettingsFormProps {
  initialKeywords: string;
  initialLocation: string;
  initialRadius: number;
}

// Common trades for German craftsmen
const SUGGESTED_KEYWORDS = [
  { label: "Elektriker", value: "Elektro, Elektroinstallation" },
  { label: "Maler", value: "Maler, Malerarbeiten, Anstrich" },
  { label: "Dachdecker", value: "Dachdecker, Dacharbeiten, Dachsanierung" },
  { label: "Sanitär", value: "Sanitär, Sanitärinstallation, Heizung" },
  { label: "Tischler", value: "Tischler, Schreiner, Holzarbeiten" },
  { label: "Maurer", value: "Maurer, Maurerarbeiten, Rohbau" },
  { label: "Fliesenleger", value: "Fliesen, Fliesenarbeiten" },
  { label: "Zimmerer", value: "Zimmerer, Zimmerarbeiten, Holzbau" },
  { label: "Klempner", value: "Klempner, Klempnerarbeiten" },
  { label: "Gerüstbau", value: "Gerüst, Gerüstbau" },
  { label: "Trockenbau", value: "Trockenbau, Innenausbau" },
  { label: "Bodenleger", value: "Bodenleger, Bodenbelag, Parkett" },
];

export function SettingsForm({
  initialKeywords,
  initialLocation,
  initialRadius,
}: SettingsFormProps) {
  const [keywords, setKeywords] = useState(initialKeywords);
  const [location, setLocation] = useState(initialLocation);
  const [radius, setRadius] = useState(initialRadius);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSuccess(false);

    const formData = new FormData();
    formData.set("keywords", keywords);
    formData.set("location", location);
    formData.set("radius", radius.toString());

    try {
      const result = await saveSettings(formData);

      if (result.success) {
        setShowSuccess(true);
        toast.success("Profil erfolgreich gespeichert", {
          description: "Deine Sucheinstellungen wurden aktualisiert.",
        });
        // Hide success indicator after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      } else if (result.error) {
        toast.error("Fehler beim Speichern", {
          description: result.error,
        });
      }
    } catch {
      toast.error("Ein unerwarteter Fehler ist aufgetreten", {
        description: "Bitte versuche es erneut.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addKeyword = (newKeywords: string) => {
    const currentKeywords = keywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
    
    const toAdd = newKeywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => !currentKeywords.includes(k.toLowerCase()));
    
    if (toAdd.length > 0) {
      const updatedKeywords = keywords ? `${keywords}, ${toAdd.join(", ")}` : toAdd.join(", ");
      setKeywords(updatedKeywords);
      toast.success(`"${toAdd[0]}" hinzugefügt`);
    } else {
      toast.info("Diese Begriffe sind bereits vorhanden");
    }
  };

  const isKeywordActive = (value: string) => {
    const currentKeywords = keywords.toLowerCase();
    const checkKeywords = value.split(",").map((k) => k.trim().toLowerCase());
    return checkKeywords.some((k) => currentKeywords.includes(k));
  };

  return (
    <Card className="max-w-2xl border-neutral-800 bg-card">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              showSuccess ? "bg-emerald-500/10" : "bg-signal-orange/10"
            )}>
              {showSuccess ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <Search className="h-5 w-5 text-signal-orange" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Sucheinstellungen
              </h2>
              <p className="text-sm text-muted-foreground">
                Definiere dein Profil für passende Ausschreibungen
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Keywords Input */}
          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-foreground">
              Deine Gewerke / Stichworte
            </Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="keywords"
                name="keywords"
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Dachdecker, Flachdach, Sanierung"
                className={cn(
                  "pl-10 bg-background border-neutral-800",
                  "focus:border-signal-orange focus:ring-signal-orange/20"
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Trenne Begriffe mit Komma. Wir finden Ausschreibungen, die diese
              Begriffe enthalten.
            </p>
          </div>

          {/* Suggested Keywords */}
          <div className="space-y-3">
            <Label className="text-foreground flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Schnellauswahl Gewerke
            </Label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_KEYWORDS.map((item) => {
                const isActive = isKeywordActive(item.value);
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => addKeyword(item.value)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-full border transition-all",
                      isActive
                        ? "bg-signal-orange/20 border-signal-orange/50 text-signal-orange"
                        : "bg-neutral-800/50 border-neutral-700 text-muted-foreground hover:border-signal-orange/50 hover:text-foreground"
                    )}
                  >
                    {isActive && <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Input */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground">
              Dein Einsatzgebiet (Stadt oder PLZ)
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                name="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Berlin"
                className={cn(
                  "pl-10 bg-background border-neutral-800",
                  "focus:border-signal-orange focus:ring-signal-orange/20"
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Gib deine Stadt oder Postleitzahl ein.
            </p>
          </div>

          {/* Radius Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="radius" className="text-foreground">
                Maximaler Umkreis
              </Label>
              <span className="text-sm font-medium text-signal-orange tabular-nums">
                {radius} km
              </span>
            </div>
            <Slider
              id="radius"
              name="radius"
              value={[radius]}
              onValueChange={(value) => setRadius(value[0])}
              min={0}
              max={200}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 km (nur Stadt)</span>
              <span>200 km</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-lg border border-neutral-800 bg-secondary/30 p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Tipp:</span> Je
              präziser deine Angaben, desto besser sind die Treffer. Du kannst
              die Einstellungen jederzeit ändern.
            </p>
          </div>
        </CardContent>

        <CardFooter className="border-t border-neutral-800 pt-6">
          <Button
            type="submit"
            disabled={isSaving}
            className={cn(
              "shadow-lg transition-all",
              showSuccess 
                ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" 
                : "bg-signal-orange hover:bg-signal-orange-hover shadow-signal-orange/20",
              "text-white"
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Speichern...
              </>
            ) : showSuccess ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Gespeichert!
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Änderungen speichern
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
