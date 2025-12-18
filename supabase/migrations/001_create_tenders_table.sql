-- Create tenders table for storing scraped tender data
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.tenders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    budget TEXT,
    deadline TEXT,
    category TEXT,
    source_url TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS tenders_title_idx ON public.tenders USING gin (to_tsvector('german', title));
CREATE INDEX IF NOT EXISTS tenders_description_idx ON public.tenders USING gin (to_tsvector('german', coalesce(description, '')));
CREATE INDEX IF NOT EXISTS tenders_category_idx ON public.tenders (category);
CREATE INDEX IF NOT EXISTS tenders_created_at_idx ON public.tenders (created_at DESC);

-- Enable RLS
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all tenders
CREATE POLICY "Authenticated users can read tenders"
    ON public.tenders
    FOR SELECT
    TO authenticated
    USING (true);

-- Only service role can insert/update/delete (for scraper)
CREATE POLICY "Service role can manage tenders"
    ON public.tenders
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenders_updated_at
    BEFORE UPDATE ON public.tenders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.tenders (title, description, location, budget, deadline, category, source_url) VALUES
(
    'Sanierung Flachdach Gemeindehaus',
    'Die Gemeinde Bad Friedrichshall sucht einen erfahrenen Fachbetrieb für die komplette Sanierung des Flachdaches am Gemeindehaus. Umfang: ca. 450 m² Dachfläche, Abdichtung, Dämmung und Entwässerung nach aktuellen EnEV-Vorgaben.',
    'Bad Friedrichshall',
    '85.000 €',
    '2025-01-15',
    'Dachdeckerarbeiten',
    'https://www.service.bund.de/example1'
),
(
    'Elektroinstallation Neubau Kindergarten',
    'Komplette Elektroinstallation für den Neubau eines zweigruppigen Kindergartens. Inkl. Beleuchtung, Sicherheitstechnik, Netzwerk und Smart-Home-Vorbereitung.',
    'München-Pasing',
    '120.000 €',
    '2025-01-20',
    'Elektroarbeiten',
    'https://www.service.bund.de/example2'
),
(
    'Fassadensanierung Rathaus',
    'Umfassende Sanierung der historischen Rathausfassade inkl. Gerüstbau, Putzarbeiten, Natursteinsanierung und abschließender Farbgestaltung nach Denkmalschutzvorgaben.',
    'Heidelberg',
    '250.000 €',
    '2025-02-01',
    'Fassadenarbeiten',
    'https://www.service.bund.de/example3'
),
(
    'Heizungsmodernisierung Schulzentrum',
    'Austausch der bestehenden Gasheizung gegen eine moderne Wärmepumpenanlage. Inkl. Planung, Demontage Altanlage, Installation und Inbetriebnahme.',
    'Stuttgart',
    '180.000 €',
    '2025-01-25',
    'Heizung/Sanitär',
    'https://www.service.bund.de/example4'
),
(
    'Malerarbeiten Bürogebäude',
    'Innenanstrich für ein 3-stöckiges Verwaltungsgebäude. Ca. 2.000 m² Wandfläche, inkl. Spachtelarbeiten und Grundierung. Arbeiten müssen außerhalb der Geschäftszeiten erfolgen.',
    'Berlin-Mitte',
    '45.000 €',
    '2025-01-18',
    'Malerarbeiten',
    'https://www.service.bund.de/example5'
);

