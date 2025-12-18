"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Crosshair, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "#funktionen", label: "Funktionen" },
  { href: "#preise", label: "Preise" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-orange">
              <Crosshair className="h-5 w-5 text-white" />
            </div>
            <span>
              Tender<span className="text-signal-orange">Sniper</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <Link
              href="/login"
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-lg px-4",
                "text-sm font-medium text-foreground",
                "border border-border bg-transparent",
                "transition-all hover:bg-secondary hover:border-muted-foreground/30"
              )}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-lg px-4",
                "text-sm font-medium text-primary-foreground",
                "bg-signal-orange",
                "transition-all hover:bg-signal-orange-hover",
                "shadow-lg shadow-signal-orange/25"
              )}
            >
              Jetzt starten
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menü öffnen"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border glass">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-border">
              <Link
                href="/login"
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-lg px-4",
                  "text-sm font-medium text-foreground",
                  "border border-border bg-transparent",
                  "transition-all hover:bg-secondary"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-lg px-4",
                  "text-sm font-medium text-primary-foreground",
                  "bg-signal-orange",
                  "transition-all hover:bg-signal-orange-hover"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Jetzt starten
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


