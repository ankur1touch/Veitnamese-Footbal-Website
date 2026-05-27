import { NextResponse, type NextRequest } from 'next/server';
import { getLiveMatches } from '@/lib/football-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type MatchesTab = 'live' | 'upcoming' | 'results' | 'all';

function parseTab(value: unknown): MatchesTab {
  if (value === 'upcoming' || value === 'results' || value === 'all') return value;
  return 'live';
}

function parseLeagueId(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return undefined;
}

async function readBody(req: NextRequest): Promise<{ leagueId?: string; tab?: MatchesTab }> {
  try {
    const raw = (await req.json()) as unknown;
    if (!raw || typeof raw !== 'object') return {};
    const obj = raw as Record<string, unknown>;
    return {
      leagueId: parseLeagueId(obj.leagueId),
      tab: obj.tab ? parseTab(obj.tab) : undefined,
    };
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  try {
    const { leagueId, tab } = await readBody(req);
    const matches = await getLiveMatches(leagueId, tab ?? 'live');
    return NextResponse.json(matches, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (err) {
    console.error('[/api/matches] error', err);
    return NextResponse.json({ error: 'Failed to load matches' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const leagueId = url.searchParams.get('leagueId') ?? undefined;
  const tab = parseTab(url.searchParams.get('tab'));
  const matches = await getLiveMatches(leagueId, tab);
  return NextResponse.json(matches);
}
