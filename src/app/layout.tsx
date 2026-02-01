import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TenderSniper | Öffentliche Aufträge automatisch finden",
  description:
    "Wir scannen täglich tausende Ausschreibungen auf bund.de. Unsere KI filtert und schickt dir nur die Aufträge, die zu deinem Handwerksbetrieb passen.",
  keywords: [
    "Ausschreibungen",
    "öffentliche Aufträge",
    "Handwerk",
    "Bau",
    "bund.de",
    "KI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <div className="relative min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>

        {/* Global Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111111",
              border: "1px solid #262626",
              color: "#EDEDED",
            },
          }}
        />
      </body>
    </html>
  );
}
