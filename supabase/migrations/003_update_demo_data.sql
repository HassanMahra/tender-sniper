-- Update Demo Data: Change deadlines from 2025 to 2026 and add more realistic tenders
-- Run this in Supabase SQL editor

-- First, update existing tenders to have 2026 deadlines
UPDATE tenders 
SET deadline = REPLACE(deadline::text, '2025', '2026')::date
WHERE deadline::text LIKE '%2025%';

-- Insert additional demo tenders with variety
INSERT INTO tenders (title, description, location, budget, deadline, category, status, source_url, published_at)
VALUES 
  (
    'Elektroinstallation Neubau Feuerwache',
    'Komplette Elektroinstallation für den Neubau der Feuerwache Nord. Inklusive Notbeleuchtung, Brandmeldeanlage und KNX-Steuerung. Ausführung nach VDE-Normen.',
    'Dresden, Sachsen',
    '185.000 €',
    '2026-03-15',
    'Elektroinstallation',
    'new',
    'https://example.com/tender/dresden-feuerwache',
    NOW()
  ),
  (
    'Malerarbeiten Verwaltungsgebäude',
    'Innen- und Außenanstrich des städtischen Verwaltungsgebäudes. Ca. 3.500m² Wandfläche, Gerüststellung inklusive. Farbtöne nach Denkmalschutzvorgaben.',
    'Düsseldorf, NRW',
    '78.000 €',
    '2026-02-28',
    'Malerarbeiten',
    'new',
    'https://example.com/tender/duesseldorf-verwaltung',
    NOW()
  ),
  (
    'Dachsanierung Sporthalle Süd',
    'Komplettsanierung Flachdach mit Wärmedämmung nach GEG. Fläche ca. 1.200m², inkl. Entwässerung und Lichtkuppeln.',
    'Stuttgart, Baden-Württemberg',
    '245.000 €',
    '2026-04-01',
    'Dachdeckerarbeiten',
    'new',
    'https://example.com/tender/stuttgart-sporthalle',
    NOW()
  ),
  (
    'Heizungsmodernisierung Schulkomplex',
    'Austausch der Gasheizung gegen Wärmepumpenanlage. 3 Gebäude mit insgesamt 8.000m² beheizte Fläche. Förderung nach BEG.',
    'Hannover, Niedersachsen',
    '420.000 €',
    '2026-05-15',
    'Heizung/Sanitär',
    'new',
    'https://example.com/tender/hannover-schule',
    NOW()
  ),
  (
    'Fassadensanierung Wohnblock',
    'WDVS-Fassade für 6-geschossigen Wohnblock. Ca. 2.800m² Fassadenfläche. Gerüst, Dämmung, Putz und Anstrich.',
    'Leipzig, Sachsen',
    '156.000 €',
    '2026-03-01',
    'Fassadenbau',
    'new',
    'https://example.com/tender/leipzig-wohnblock',
    NOW()
  ),
  (
    'Trockenbauarbeiten Bürogebäude',
    'Innenausbau Büroetage 3. OG. Ständerwerk, Beplankung, Akustikdecken. Ca. 850m² Nutzfläche.',
    'Nürnberg, Bayern',
    '92.000 €',
    '2026-02-15',
    'Trockenbau',
    'new',
    'https://example.com/tender/nuernberg-buero',
    NOW()
  ),
  (
    'Bodenbelagsarbeiten Kulturzentrum',
    'Verlegung von Parkett und Designbelag im neuen Kulturzentrum. Ca. 1.400m² inkl. Unterbodenarbeiten.',
    'Bremen, Bremen',
    '68.000 €',
    '2026-04-20',
    'Bodenbelag',
    'new',
    'https://example.com/tender/bremen-kultur',
    NOW()
  )
ON CONFLICT DO NOTHING;
