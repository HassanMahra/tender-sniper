import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { mapDbTenderToTender } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const status = searchParams.get('status');
    const showAll = searchParams.get('showAll') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = await createClient();

    // Get user settings for keyword filtering (unless showAll is true)
    let keywords: string[] = [];
    
    if (!showAll) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: userSettings } = await supabase
          .from('user_settings')
          .select('keywords')
          .eq('user_id', user.id)
          .single();
        
        if (userSettings?.keywords) {
          keywords = userSettings.keywords
            .split(',')
            .map((k: string) => k.trim().toLowerCase())
            .filter(Boolean);
        }
      }
    }

    // Start building the query
    let supabaseQuery = supabase
      .from('tenders')
      .select('*', { count: 'exact' });

    // Apply keyword filter if we have keywords and not showing all
    if (!showAll && keywords.length > 0) {
      const orConditions = keywords
        .map((keyword: string) => 
          `title.ilike.%${keyword}%,description.ilike.%${keyword}%,category.ilike.%${keyword}%`
        )
        .join(',');
      supabaseQuery = supabaseQuery.or(orConditions);
    }

    // Apply text search filter
    if (query) {
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

    // Calculate match scores if we have keywords
    const tenders = (rows || []).map(row => {
      const tender = mapDbTenderToTender(row);
      if (keywords.length > 0) {
        const searchText = `${row.title} ${row.description || ''} ${row.category || ''}`.toLowerCase();
        let matches = 0;
        for (const keyword of keywords) {
          if (searchText.includes(keyword)) {
            matches++;
          }
        }
        tender.matchScore = Math.min(60 + (matches / keywords.length) * 38, 98);
      }
      return tender;
    });

    return NextResponse.json({ tenders, count: count || 0 });
  } catch (error: unknown) {
    console.error("API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal Server Error", details: message }, { status: 500 });
  }
}
