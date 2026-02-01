/**
 * Mock data for development and design preview
 * Replace with real API data in production
 */

export interface Tender {
  id: string;
  title: string;
  location: string;
  budget: string;
  matchScore: number;
  deadline: string;
  category: string;
  description?: string;
}

export const mockTenders: Tender[] = [
  {
    id: "tender-001",
    title: "Sanierung Grundschule Fensterbau",
    location: "München, Bayern",
    budget: "150.000 €",
    matchScore: 98,
    deadline: "2025-01-15",
    category: "Fensterbau",
    description: "Austausch von 45 Fenstern inkl. Demontage der Altfenster und fachgerechter Entsorgung.",
  },
  {
    id: "tender-002",
    title: "Dachsanierung Rathaus Mitte",
    location: "Berlin, Berlin",
    budget: "340.000 €",
    matchScore: 94,
    deadline: "2025-01-22",
    category: "Dachdeckerarbeiten",
    description: "Komplettsanierung des Daches inkl. Dämmung nach EnEV. Denkmalschutzauflagen beachten.",
  },
  {
    id: "tender-003",
    title: "Elektroinstallation Klinikum Nord",
    location: "Hamburg, Hamburg",
    budget: "95.000 €",
    matchScore: 87,
    deadline: "2025-02-01",
    category: "Elektroinstallation",
    description: "Neuverkabelung Station 4B, Installation Notstromversorgung, KNX-Steuerung.",
  },
  {
    id: "tender-004",
    title: "Fassadenarbeiten Schulzentrum",
    location: "Frankfurt, Hessen",
    budget: "k.A.",
    matchScore: 76,
    deadline: "2025-02-10",
    category: "Fassadenbau",
    description: "WDVS-Fassade ca. 2.400m², Gerüststellung, Malerarbeiten im Anschluss.",
  },
  {
    id: "tender-005",
    title: "Sanitärinstallation Sporthalle",
    location: "Köln, NRW",
    budget: "62.000 €",
    matchScore: 71,
    deadline: "2025-02-18",
    category: "Sanitär",
    description: "Erneuerung der Sanitäranlagen in beiden Umkleidebereichen inkl. barrierefreier Umbau.",
  },
];

// User profile mock data
export interface UserProfile {
  name: string;
  company: string;
  email: string;
  trades: string[];
  regions: string[];
}

export const mockUser: UserProfile = {
  name: "Max Mustermann",
  company: "Mustermann Bau GmbH",
  email: "max@mustermann-bau.de",
  trades: ["Fensterbau", "Fassadenbau", "Dachdeckerarbeiten"],
  regions: ["Bayern", "Baden-Württemberg"],
};

