import Link from "next/link";
import { Crosshair } from "lucide-react";

const legalLinks = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 py-8 md:flex-row md:py-6">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-signal-orange">
                <Crosshair className="h-4 w-4 text-white" />
              </div>
              <span>
                Tender<span className="text-signal-orange">Sniper</span>
              </span>
            </Link>
            <span className="text-sm text-muted-foreground">
              © {currentYear} TenderSniper. Alle Rechte vorbehalten.
            </span>
          </div>

          {/* Legal Links */}
          <nav className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}


