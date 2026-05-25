import { NextResponse, type NextRequest } from 'next/server';
import leaguesData from '@/data/leagues.json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json(leaguesData, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
  });
}

export async function GET() {
  return NextResponse.json(leaguesData, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
  });
}
