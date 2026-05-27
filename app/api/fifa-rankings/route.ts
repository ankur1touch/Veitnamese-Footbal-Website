import { NextResponse } from 'next/server';
import { getFifaRankings } from '@/lib/football-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rankings = await getFifaRankings(10);
    return NextResponse.json(rankings, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' },
    });
  } catch (err) {
    console.error('[/api/fifa-rankings] error', err);
    return NextResponse.json({ error: 'Failed to load FIFA rankings' }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
