/**
 * Database type definitions for Supabase tables
 */

export interface DbTender {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  budget: string | null;
  deadline: string | null;
  category: string | null;
  source_url: string | null;
  published_at: string | null;
  requirements: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface DbUserSettings {
  id: string;
  user_id: string;
  keywords: string | null;
  location: string | null;
  radius: number;
  created_at: string;
  updated_at: string;
}

/**
 * Tender type for frontend use (with computed fields)
 */
export interface Tender {
  id: string;
  title: string;
  description: string | null;
  location: string;
  budget: string;
  deadline: string;
  category: string;
  source_url: string | null;
  matchScore?: number;
}

/**
 * Convert database tender to frontend tender
 */
export function mapDbTenderToTender(dbTender: DbTender): Tender {
  return {
    id: dbTender.id,
    title: dbTender.title,
    description: dbTender.description,
    location: dbTender.location || "Deutschland",
    budget: dbTender.budget || "k.A.",
    deadline: dbTender.deadline || new Date().toISOString(),
    category: dbTender.category || "Allgemein",
    source_url: dbTender.source_url,
  };
}

