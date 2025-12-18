import Link from "next/link";
import { cn } from "@/lib/utils";
import { Brain, Bell, FileText, ArrowRight, Play, Zap, Shield, Clock } from "lucide-react";

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-signal-orange/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-tech-blue/5 rounded-full blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Zap className="h-4 w-4 text-signal-orange" />
            <span className="text-muted-foreground">Jetzt für Handwerker & Baufirmen</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block text-foreground">Die lukrativsten Aufträge.</span>
            <span className="block mt-2 text-gradient">Automatisch in deinem Postfach.</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Wir scannen täglich tausende Ausschreibungen auf bund.de. Unsere KI filtert den 
            Bürokratie-Müll und schickt dir nur das, was du wirklich bauen kannst.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className={cn(
                "group inline-flex h-12 items-center justify-center gap-2 rounded-xl px-8",
                "text-base font-semibold text-primary-foreground",
                "bg-signal-orange",
                "transition-all hover:bg-signal-orange-hover",
                "shadow-lg shadow-signal-orange/25 hover:shadow-xl hover:shadow-signal-orange/30"
              )}
            >
              Kostenlos testen
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#demo"
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 rounded-xl px-8",
                "text-base font-medium text-foreground",
                "border border-border bg-card/50 backdrop-blur-sm",
                "transition-all hover:bg-secondary hover:border-muted-foreground/30"
              )}
            >
              <Play className="h-4 w-4 text-signal-orange" />
              Demo ansehen
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-tech-blue" />
              <span>DSGVO-konform</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-tech-blue" />
              <span>Einrichtung in 5 Minuten</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-tech-blue" />
              <span>Keine Kreditkarte nötig</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="glow-border rounded-2xl">
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl",
                "bg-card border border-border",
                "glow-orange"
              )}
            >
              {/* Mock Dashboard Header */}
              <div className="flex items-center gap-2 border-b border-border bg-secondary/30 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-4 text-xs text-muted-foreground">TenderSniper Dashboard</span>
              </div>

              {/* Mock Dashboard Content */}
              <div className="p-6 md:p-8">
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Stat Card 1 */}
                  <div className="rounded-xl bg-secondary/50 p-4 border border-border">
                    <p className="text-sm text-muted-foreground">Neue Aufträge heute</p>
                    <p className="mt-1 text-3xl font-bold text-signal-orange">47</p>
                  </div>
                  {/* Stat Card 2 */}
                  <div className="rounded-xl bg-secondary/50 p-4 border border-border">
                    <p className="text-sm text-muted-foreground">Passend für dich</p>
                    <p className="mt-1 text-3xl font-bold text-tech-blue">12</p>
                  </div>
                  {/* Stat Card 3 */}
                  <div className="rounded-xl bg-secondary/50 p-4 border border-border">
                    <p className="text-sm text-muted-foreground">Gesamtwert</p>
                    <p className="mt-1 text-3xl font-bold text-foreground">€2.4M</p>
                  </div>
                </div>

                {/* Mock List */}
                <div className="mt-6 space-y-3">
                  {[
                    { title: "Dachsanierung Rathaus Berlin-Mitte", value: "€340.000", match: "98%" },
                    { title: "Fassadenarbeiten Schulzentrum München", value: "€180.000", match: "94%" },
                    { title: "Elektroinstallation Klinikum Hamburg", value: "€95.000", match: "87%" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-background/50 p-4 border border-border"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                      </div>
                      <div className="rounded-full bg-signal-orange/10 px-3 py-1 text-sm font-medium text-signal-orange">
                        {item.match} Match
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-card border border-border",
        "p-6 md:p-8",
        "transition-all duration-300 hover:border-muted-foreground/30",
        "hover:shadow-lg hover:shadow-signal-orange/5",
        className
      )}
    >
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-signal-orange/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-signal-orange/10 text-signal-orange">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "KI-Analyse",
      description:
        "Keine 200 Seiten lesen. Wir fassen die wichtigsten Punkte zusammen und zeigen dir sofort, ob der Auftrag passt.",
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "WhatsApp Alarm",
      description:
        "Sofort wissen, wenn ein Auftrag in deiner Stadt ist. Push-Benachrichtigung aufs Handy – kein Login nötig.",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Bewerbungs-Autopilot",
      description:
        "Wir füllen die Formulare für dich vor. Du prüfst nur noch und klickst auf Absenden.",
    },
  ];

  return (
    <section id="funktionen" className="relative py-20 md:py-28">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Weniger suchen. Mehr bauen.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Drei Tools, die dir jeden Tag Stunden sparen.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-12 grid gap-4 md:gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section Component
function CTASection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-t from-signal-orange/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Bereit für mehr Aufträge?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Starte jetzt kostenlos und finde in wenigen Minuten passende Ausschreibungen.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className={cn(
                "group inline-flex h-12 items-center justify-center gap-2 rounded-xl px-8",
                "text-base font-semibold text-primary-foreground",
                "bg-signal-orange",
                "transition-all hover:bg-signal-orange-hover",
                "shadow-lg shadow-signal-orange/25 hover:shadow-xl hover:shadow-signal-orange/30"
              )}
            >
              14 Tage kostenlos testen
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </>
  );
}
