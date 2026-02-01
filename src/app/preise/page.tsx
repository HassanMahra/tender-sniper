import { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, Building2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Preise | TenderSniper",
  description: "Transparente Preise für TenderSniper - Finde den passenden Plan für dein Unternehmen",
};

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  highlighted?: boolean;
  icon: React.ReactNode;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "0 €",
    period: "für immer",
    description: "Für den Start",
    features: [
      "Manuelle Suche auf bund.de",
      "1 Benutzer",
      "5 Suchanfragen pro Tag",
      "Basis-Filter",
      "E-Mail-Support",
    ],
    buttonText: "Kostenlos starten",
    buttonHref: "/login",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    name: "Pro",
    price: "49 €",
    period: "pro Monat",
    description: "Der Bestseller",
    features: [
      "KI-gestützte Analyse",
      "Automatische E-Mail-Benachrichtigungen",
      "Unbegrenzte Suchanfragen",
      "WhatsApp-Alarm",
      "Bewerbungs-Autopilot",
      "Match-Score für jeden Auftrag",
      "Prioritäts-Support",
    ],
    buttonText: "Jetzt starten",
    buttonHref: "/login",
    highlighted: true,
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    name: "Enterprise",
    price: "Individuell",
    description: "Für Großbetriebe",
    features: [
      "Alles aus Pro",
      "API-Zugang",
      "Dedizierter Account Manager",
      "Custom Integrationen",
      "SLA-Garantie",
      "Mehrere Standorte",
      "Team-Verwaltung",
    ],
    buttonText: "Kontakt aufnehmen",
    buttonHref: "mailto:hassanmahra123@gmail.com",
    icon: <Building2 className="h-6 w-6" />,
  },
];

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 lg:p-8",
        tier.highlighted
          ? "border-signal-orange bg-signal-orange/5 shadow-lg shadow-signal-orange/10"
          : "border-neutral-800 bg-card"
      )}
    >
      {/* Highlighted Badge */}
      {tier.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-signal-orange px-4 py-1 text-xs font-semibold text-white">
            Beliebt
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div
          className={cn(
            "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl",
            tier.highlighted
              ? "bg-signal-orange/20 text-signal-orange"
              : "bg-secondary text-muted-foreground"
          )}
        >
          {tier.icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground">{tier.name}</h3>
        <p className="text-sm text-muted-foreground">{tier.description}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <span className="text-4xl font-bold text-foreground">{tier.price}</span>
        {tier.period && (
          <span className="ml-2 text-muted-foreground">/ {tier.period}</span>
        )}
      </div>

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-3">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check
              className={cn(
                "mt-0.5 h-5 w-5 shrink-0",
                tier.highlighted ? "text-signal-orange" : "text-emerald-400"
              )}
            />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <Link
        href={tier.buttonHref}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-medium transition-all",
          tier.highlighted
            ? "bg-signal-orange text-white hover:bg-signal-orange-hover shadow-lg shadow-signal-orange/25"
            : "border border-neutral-700 text-foreground hover:bg-secondary"
        )}
      >
        {tier.buttonText}
      </Link>
    </div>
  );
}

export default function PreisePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        {/* Background */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-signal-orange/5 rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Mehr Aufträge, weniger Suchen.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Wähle den Plan, der zu deinem Betrieb passt. Jederzeit kündbar.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative pb-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="border-t border-neutral-800 py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Noch Fragen?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Schreib uns eine E-Mail an{" "}
            <a
              href="mailto:hassanmahra123@gmail.com"
              className="text-signal-orange hover:underline"
            >
              hassanmahra123@gmail.com
            </a>{" "}
            – wir antworten innerhalb von 24 Stunden.
          </p>
        </div>
      </section>
    </div>
  );
}

