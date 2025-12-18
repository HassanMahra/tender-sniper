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
import { MapPin, Search, Loader2, Save, Tag } from "lucide-react";

interface SettingsFormProps {
  initialKeywords: string;
  initialLocation: string;
  initialRadius: number;
}

export function SettingsForm({
  initialKeywords,
  initialLocation,
  initialRadius,
}: SettingsFormProps) {
  const [keywords, setKeywords] = useState(initialKeywords);
  const [location, setLocation] = useState(initialLocation);
  const [radius, setRadius] = useState(initialRadius);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.set("keywords", keywords);
    formData.set("location", location);
    formData.set("radius", radius.toString());

    try {
      const result = await saveSettings(formData);

      if (result.success) {
        toast.success("Profil erfolgreich gespeichert", {
          description: "Deine Sucheinstellungen wurden aktualisiert.",
        });
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

  return (
    <Card className="max-w-2xl border-neutral-800 bg-card">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-signal-orange/10">
              <Search className="h-5 w-5 text-signal-orange" />
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
            className="bg-signal-orange hover:bg-signal-orange-hover text-white shadow-lg shadow-signal-orange/20"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Speichern...
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

