import { NextResponse, NextRequest } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const dbPath = path.join(process.cwd(), 'backend', 'tenders.db');
    // verbose: console.log
    const db = new Database(dbPath);

    // Check if table exists
    const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='tenders'").get();
    
    if (!tableCheck) {
      db.close();
      return NextResponse.json({ tenders: [], count: 0 });
    }

    // Fetch tenders with optional search
    let rows;
    if (query) {
      const stmt = db.prepare('SELECT * FROM tenders WHERE title LIKE ? OR description LIKE ? ORDER BY created_at DESC');
      const pattern = `%${query}%`;
      rows = stmt.all(pattern, pattern);
    } else {
      rows = db.prepare('SELECT * FROM tenders ORDER BY created_at DESC').all();
    }
    
    const tenders = rows.map((row: any) => {
      let details: any = {};
      try {
        if (row.analysis_json) {
          details = JSON.parse(row.analysis_json);
        }
      } catch (e) {
        // ignore parse error
      }

      return {
        id: row.id.toString(),
        title: row.title,
        description: row.description,
        location: details.ort || "Deutschland",
        budget: details.budget || "k.A.",
        deadline: details.frist || row.published_at,
        category: details.gewerk || "Allgemein",
        source_url: row.link,
        matchScore: 0 // Client side calculation or placeholder
      };
    });

    db.close();

    return NextResponse.json({ tenders, count: tenders.length });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
