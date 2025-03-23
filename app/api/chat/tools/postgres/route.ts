import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

interface PostgresQuery {
  query: string;
  type: 'chat_statistics' | 'user_activity' | 'message_history' | 'vote_analytics' | 'chat_visibility';
}

export async function POST(request: Request) {
  try {
    const { query, type } = await request.json() as PostgresQuery;
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid query parameter' },
        { status: 400 }
      );
    }

    // Basic SQL injection prevention
    if (query.toLowerCase().includes('drop') || 
        query.toLowerCase().includes('delete') || 
        query.toLowerCase().includes('truncate') ||
        query.toLowerCase().includes('alter')) {
      return NextResponse.json(
        { error: 'Operation not allowed' },
        { status: 403 }
      );
    }

    const result = await sql.query(query);
    
    // Transform the first row into the expected format
    const formattedData = result.rows[0] || {};
    
    return NextResponse.json({ 
      rows: formattedData,
      type 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Postgres query error:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 