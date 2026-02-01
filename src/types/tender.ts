export interface Tender {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  budget: string | null;
  deadline: string | null;
  category: string | null;
  source_url: string;
  published_at: string | null;
  requirements?: string[]; // Optional, as it might not be in DB yet
  created_at: string;
  updated_at: string;
}

export interface TenderScanStats {
  gefunden: number;
  uebersprungen: number;
  analysiert: number;
  fehler: number;
  verbleibend: number;
}

export interface ScanResponse {
  success: boolean;
  stats?: TenderScanStats;
  message?: string;
  error?: string; // Error message
  processed?: Partial<Tender>[];
  errors?: { url?: string; error: string }[];
}
