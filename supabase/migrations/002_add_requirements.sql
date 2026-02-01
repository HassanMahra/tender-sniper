-- Add requirements column to tenders table
ALTER TABLE public.tenders ADD COLUMN IF NOT EXISTS requirements TEXT[] DEFAULT '{}';
