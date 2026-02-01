import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { mapDbTenderToTender } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = await createClient();

    // Start building the query
    let supabaseQuery = supabase
      .from('tenders')
      .select('*', { count: 'exact' });

    // Apply filters
    if (query) {
      // Basic search on title or description
      // Note: textSearch or ilike can be used depending on DB setup. 
      // Using ilike for broad compatibility if full text search isn't set up.
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    if (status && status !== 'all') {
      supabaseQuery = supabaseQuery.eq('status', status);
    }

    // Apply pagination and sorting
    supabaseQuery = supabaseQuery
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data: rows, error, count } = await supabaseQuery;

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const tenders = (rows || []).map(mapDbTenderToTender);

    return NextResponse.json({ tenders, count: count || 0 });
  } catch (error: unknown) {
    console.error("API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal Server Error", details: message }, { status: 500 });
  }
}
