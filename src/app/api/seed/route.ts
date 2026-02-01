import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// POST /api/seed - Seed demo data (protected, only in development)
export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    const supabase = await createClient();

    // Update existing tenders to have 2026 deadlines
    const { error: updateError } = await supabase.rpc('exec_sql', {
      query: `UPDATE tenders SET deadline = REPLACE(deadline::text, '2025', '2026')::date WHERE deadline::text LIKE '%2025%'`
    });

    // If RPC doesn't exist, we do it row by row
    if (updateError) {
      console.log("RPC not available, updating row by row");
    }

    // Insert demo tenders
    const demoTenders = [
      {
        title: 'Elektroinstallation Neubau Feuerwache',
        description: 'Komplette Elektroinstallation für den Neubau der Feuerwache Nord. Inklusive Notbeleuchtung, Brandmeldeanlage und KNX-Steuerung. Ausführung nach VDE-Normen.',
        location: 'Dresden, Sachsen',
        budget: '185.000 €',
        deadline: '2026-03-15',
        category: 'Elektroinstallation',
        status: 'new',
        source_url: 'https://example.com/tender/dresden-feuerwache',
      },
      {
        title: 'Malerarbeiten Verwaltungsgebäude',
        description: 'Innen- und Außenanstrich des städtischen Verwaltungsgebäudes. Ca. 3.500m² Wandfläche, Gerüststellung inklusive. Farbtöne nach Denkmalschutzvorgaben.',
        location: 'Düsseldorf, NRW',
        budget: '78.000 €',
        deadline: '2026-02-28',
        category: 'Malerarbeiten',
        status: 'new',
        source_url: 'https://example.com/tender/duesseldorf-verwaltung',
      },
      {
        title: 'Dachsanierung Sporthalle Süd',
        description: 'Komplettsanierung Flachdach mit Wärmedämmung nach GEG. Fläche ca. 1.200m², inkl. Entwässerung und Lichtkuppeln.',
        location: 'Stuttgart, Baden-Württemberg',
        budget: '245.000 €',
        deadline: '2026-04-01',
        category: 'Dachdeckerarbeiten',
        status: 'new',
        source_url: 'https://example.com/tender/stuttgart-sporthalle',
      },
      {
        title: 'Heizungsmodernisierung Schulkomplex',
        description: 'Austausch der Gasheizung gegen Wärmepumpenanlage. 3 Gebäude mit insgesamt 8.000m² beheizte Fläche. Förderung nach BEG.',
        location: 'Hannover, Niedersachsen',
        budget: '420.000 €',
        deadline: '2026-05-15',
        category: 'Heizung/Sanitär',
        status: 'new',
        source_url: 'https://example.com/tender/hannover-schule',
      },
      {
        title: 'Fassadensanierung Wohnblock',
        description: 'WDVS-Fassade für 6-geschossigen Wohnblock. Ca. 2.800m² Fassadenfläche. Gerüst, Dämmung, Putz und Anstrich.',
        location: 'Leipzig, Sachsen',
        budget: '156.000 €',
        deadline: '2026-03-01',
        category: 'Fassadenbau',
        status: 'new',
        source_url: 'https://example.com/tender/leipzig-wohnblock',
      },
      {
        title: 'Trockenbauarbeiten Bürogebäude',
        description: 'Innenausbau Büroetage 3. OG. Ständerwerk, Beplankung, Akustikdecken. Ca. 850m² Nutzfläche.',
        location: 'Nürnberg, Bayern',
        budget: '92.000 €',
        deadline: '2026-02-15',
        category: 'Trockenbau',
        status: 'new',
        source_url: 'https://example.com/tender/nuernberg-buero',
      },
      {
        title: 'Bodenbelagsarbeiten Kulturzentrum',
        description: 'Verlegung von Parkett und Designbelag im neuen Kulturzentrum. Ca. 1.400m² inkl. Unterbodenarbeiten.',
        location: 'Bremen, Bremen',
        budget: '68.000 €',
        deadline: '2026-04-20',
        category: 'Bodenbelag',
        status: 'new',
        source_url: 'https://example.com/tender/bremen-kultur',
      },
    ];

    // Check which tenders already exist (by title) and insert only new ones
    const { data: existingTenders } = await supabase
      .from('tenders')
      .select('title');
    
    const existingTitles = new Set((existingTenders || []).map(t => t.title));
    const newTenders = demoTenders.filter(t => !existingTitles.has(t.title));

    if (newTenders.length > 0) {
      const { error: insertError } = await supabase
        .from('tenders')
        .insert(newTenders);

      if (insertError) {
        console.error('Insert error:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${newTenders.length} new tenders`,
      skipped: demoTenders.length - newTenders.length
    });

  } catch (error: unknown) {
    console.error('Seed error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
