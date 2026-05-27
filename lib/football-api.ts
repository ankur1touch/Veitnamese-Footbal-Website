import { cache } from 'react';
import type { LiveMatch, StandingRow, TopScorer, FifaRanking, FixtureDetail, MatchDetailPayload } from './types';
import { createTimedCache } from './memory-cache';
import { resolveTeamBrand } from './team-logos';
import { resolveLeague, DEFAULT_LEAGUE, LEAGUES } from './league-config';
import {
  fetchCmsLiveMatches,
  fetchCmsMatchesForLeague,
  fetchCmsStandings,
  fetchCmsTopScorers,
  fetchCmsFixtures,
  fetchMatchDetailPayload,
} from './api-football-cms';

const FOOTBALL_DATA_BASE = 'https://api.football-data.org/v4';
const LA_LIGA_CODE = 'PD';
const UCL_CODE = 'CL';

function getToken(): string | undefined {
  return process.env.FOOTBALL_DATA_TOKEN;
}

async function fdFetch<T>(path: string): Promise<T | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${FOOTBALL_DATA_BASE}${path}`, {
      headers: { 'X-Auth-Token': token },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`[football-data] ${path} -> ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[football-data] error ${path}:`, (err as Error).message);
    return null;
  }
}

// ---------- Keyed memory caches (per country/tab) ----------

const standingsCaches = new Map<string, ReturnType<typeof createTimedCache<StandingRow[]>>>();
const matchesCaches = new Map<string, ReturnType<typeof createTimedCache<LiveMatch[]>>>();
const scorersCaches = new Map<string, ReturnType<typeof createTimedCache<TopScorer[]>>>();
const fifaRankingsCache = createTimedCache<FifaRanking[]>(24 * 60 * 60 * 1000);

function getStandingsCache(key: string) {
  let c = standingsCaches.get(key);
  if (!c) {
    c = createTimedCache<StandingRow[]>(10 * 60 * 1000);
    standingsCaches.set(key, c);
  }
  return c;
}

function getMatchesCache(key: string) {
  let c = matchesCaches.get(key);
  if (!c) {
    c = createTimedCache<LiveMatch[]>(60 * 1000);
    matchesCaches.set(key, c);
  }
  return c;
}

function getScorersCache(key: string) {
  let c = scorersCaches.get(key);
  if (!c) {
    c = createTimedCache<TopScorer[]>(60 * 60 * 1000);
    scorersCaches.set(key, c);
  }
  return c;
}

// ---------- Football-Data.org (fallback) types ----------

interface FDStandingsResponse {
  standings: Array<{
    type: string;
    table: Array<{
      position: number;
      team: { id: number; name: string; shortName: string; tla: string; crest: string };
      playedGames: number;
      won: number;
      draw: number;
      lost: number;
      goalDifference: number;
      points: number;
    }>;
  }>;
}

interface FDMatchesResponse {
  matches: Array<{
    id: number;
    competition: { name: string };
    homeTeam: { name: string; shortName: string; crest: string };
    awayTeam: { name: string; shortName: string; crest: string };
    score: {
      fullTime: { home: number | null; away: number | null };
      halfTime?: { home: number | null; away: number | null };
    };
    status: string;
    minute?: string;
    utcDate: string;
    matchday?: number;
  }>;
}

interface FDScorersResponse {
  scorers: Array<{
    player: { name: string };
    team: { name: string; shortName: string; crest: string };
    goals: number;
  }>;
}

async function fetchStandingsFromFD(): Promise<StandingRow[] | null> {
  const data = await fdFetch<FDStandingsResponse>(`/competitions/${LA_LIGA_CODE}/bang-xep-hang`);
  if (!data) return null;
  const totalTable = data.standings.find((s) => s.type === 'TOTAL');
  if (!totalTable) return null;
  return totalTable.table.map((row) => ({
    position: row.position,
    team: row.team.name,
    teamShort: row.team.shortName || row.team.tla,
    crest: row.team.crest,
    played: row.playedGames,
    won: row.won,
    draw: row.draw,
    lost: row.lost,
    goalDifference: row.goalDifference,
    points: row.points,
  }));
}

async function fetchLiveMatchesFromFD(): Promise<LiveMatch[] | null> {
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - 1);
  const to = new Date(today);
  to.setDate(to.getDate() + 1);
  const fmt = (d: Date) => d.toISOString().split('T')[0];

  const data = await fdFetch<FDMatchesResponse>(
    `/matches?dateFrom=${fmt(from)}&dateTo=${fmt(to)}&competitions=${LA_LIGA_CODE},${UCL_CODE}`,
  );
  if (!data) return null;

  return data.matches
    .map((m): LiveMatch => ({
      id: m.id,
      competition: m.competition.name,
      homeTeam: m.homeTeam.shortName || m.homeTeam.name,
      awayTeam: m.awayTeam.shortName || m.awayTeam.name,
      homeCrest: m.homeTeam.crest,
      awayCrest: m.awayTeam.crest,
      homeScore: m.score.fullTime.home,
      awayScore: m.score.fullTime.away,
      status: m.status as LiveMatch['status'],
      minute: m.minute,
      utcDate: m.utcDate,
    }))
    .sort((a, b) => {
      const order = { IN_PLAY: 0, LIVE: 0, PAUSED: 1, FINISHED: 2, FT: 2, HT: 0, SCHEDULED: 3 } as Record<string, number>;
      return (order[a.status] ?? 4) - (order[b.status] ?? 4);
    });
}

async function fetchTopScorersFromFD(): Promise<TopScorer[] | null> {
  const data = await fdFetch<FDScorersResponse>(`/competitions/${LA_LIGA_CODE}/scorers?limit=10`);
  if (!data) return null;
  return data.scorers.map((s) => ({
    name: s.player.name,
    team: s.team.shortName || s.team.name,
    goals: s.goals,
    crest: s.team.crest,
  }));
}

// ---------- Public API (cached + leagueId-aware) ----------

export const getStandings = cache(async (leagueId?: string | number): Promise<StandingRow[]> => {
  const cfg = resolveLeague(leagueId);
  const key = `${cfg.leagueId}:${cfg.season}`;
  return getStandingsCache(key)(async () => {
    const cms = await fetchCmsStandings(cfg.leagueId, cfg.season);
    if (cms && cms.length > 0) return cms;

    if (cfg.leagueId === 140) {
      const fd = await fetchStandingsFromFD();
      if (fd && fd.length > 0) return fd;
    }
    return FALLBACK_STANDINGS;
  });
});

export const getTopScorers = cache(async (leagueId?: string | number): Promise<TopScorer[]> => {
  const cfg = resolveLeague(leagueId);
  const key = `${cfg.leagueId}:${cfg.season}`;
  return getScorersCache(key)(async () => {
    const cms = await fetchCmsTopScorers(cfg.leagueId, cfg.season);
    if (cms && cms.length > 0) return cms;

    if (cfg.leagueId === 140) {
      const fd = await fetchTopScorersFromFD();
      if (fd && fd.length > 0) return fd;
    }
    return FALLBACK_SCORERS;
  });
});

export const getLiveMatches = cache(
  async (
    leagueId?: string | number,
    tab: 'live' | 'upcoming' | 'results' | 'all' = 'live',
  ): Promise<LiveMatch[]> => {
    const cfg = resolveLeague(leagueId);
    const key = `${cfg.leagueId}:${cfg.season}:${tab}`;
    return getMatchesCache(key)(async () => {
      if (tab === 'all') {
        const [live, upcoming, recent] = await Promise.all([
          fetchCmsLiveMatches(cfg.leagueId),
          fetchCmsFixtures(cfg.leagueId, cfg.season, { next: 8 }),
          fetchCmsFixtures(cfg.leagueId, cfg.season, { last: 8 }),
        ]);
        const merged = [...(live ?? []), ...(upcoming ?? []), ...(recent ?? [])];
        const unique = merged.filter(
          (m, i, arr) => arr.findIndex((x) => x.id === m.id) === i,
        );
        if (unique.length > 0) return enrichMatches(unique);
      }

      const cms = await fetchCmsMatchesForLeague(cfg.leagueId, cfg.season, tab === 'all' ? 'live' : tab);
      if (cms && cms.length > 0) return enrichMatches(cms);

      if (cfg.leagueId === 140) {
        if (tab === 'live' || tab === 'all') {
          const liveOnly = await fetchCmsLiveMatches(cfg.leagueId);
          if (liveOnly && liveOnly.length > 0) return enrichMatches(liveOnly);
        }
        const fd = await fetchLiveMatchesFromFD();
        if (fd && fd.length > 0) return enrichMatches(fd);
      }
      return enrichMatches(FALLBACK_MATCHES);
    });
  },
);

export const getTickerMatches = cache(async (): Promise<LiveMatch[]> => {
  return getMatchesCache('ticker:global')(async () => {
    const [live, eplRecent, uclRecent] = await Promise.all([
      fetchCmsLiveMatches(),
      fetchCmsFixtures(LEAGUES.epl.id, LEAGUES.epl.season, { last: 6 }),
      fetchCmsFixtures(LEAGUES.ucl.id, LEAGUES.ucl.season, { last: 4 }),
    ]);
    const merged = [...(live ?? []), ...(eplRecent ?? []), ...(uclRecent ?? [])];
    const unique = merged.filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);
    if (unique.length > 0) {
      return enrichMatches(unique).sort((a, b) => {
        const order = { IN_PLAY: 0, LIVE: 0, HT: 0, PAUSED: 1, FINISHED: 2, FT: 2, SCHEDULED: 3 } as Record<string, number>;
        return (order[a.status] ?? 4) - (order[b.status] ?? 4);
      });
    }
    return enrichMatches(FALLBACK_MATCHES);
  });
});

export const getMatchOfTheDay = cache(async (): Promise<LiveMatch | null> => {
  for (const league of [LEAGUES.epl, LEAGUES.ucl, LEAGUES.vleague]) {
    const upcoming = await getLiveMatches(league.id, 'upcoming');
    const pick = upcoming.find((m) => m.status === 'SCHEDULED') ?? upcoming[0];
    if (pick) return pick;
  }
  const live = await getLiveMatches(undefined, 'live');
  return live[0] ?? FALLBACK_MATCHES[2] ?? null;
});

export const getFifaRankings = cache(async (limit = 10): Promise<FifaRanking[]> => {
  const all = await fifaRankingsCache(async () => FALLBACK_FIFA_RANKINGS);
  return all.slice(0, limit);
});

function mapLiveStatusToShort(status: LiveMatch['status']): string {
  if (status === 'FINISHED' || status === 'FT') return 'FT';
  if (status === 'IN_PLAY' || status === 'LIVE') return '2H';
  if (status === 'HT' || status === 'PAUSED') return 'HT';
  return 'NS';
}

function liveMatchToFixtureDetail(match: LiveMatch): FixtureDetail {
  const elapsed =
    match.minute && /^\d+/.test(match.minute) ? Number.parseInt(match.minute, 10) : null;

  return {
    fixture: {
      id: match.id,
      date: match.utcDate,
      status: { short: mapLiveStatusToShort(match.status), elapsed },
    },
    league: { id: 0, name: match.competition },
    teams: {
      home: {
        id: match.homeTeamId ?? match.id * 10 + 1,
        name: match.homeTeam,
        logo: match.homeCrest,
        winner:
          match.homeScore != null && match.awayScore != null
            ? match.homeScore > match.awayScore
            : null,
      },
      away: {
        id: match.awayTeamId ?? match.id * 10 + 2,
        name: match.awayTeam,
        logo: match.awayCrest,
        winner:
          match.homeScore != null && match.awayScore != null
            ? match.awayScore > match.homeScore
            : null,
      },
    },
    goals: { home: match.homeScore, away: match.awayScore },
    score: {
      fulltime: { home: match.homeScore, away: match.awayScore },
    },
  };
}

function buildMatchDetailFromLiveMatch(match: LiveMatch): MatchDetailPayload {
  return {
    fixture: liveMatchToFixtureDetail(match),
    lineups: [],
    events: [],
    stats: [],
    h2h: [],
  };
}

async function findKnownLiveMatch(fixtureId: string): Promise<LiveMatch | null> {
  const id = Number(fixtureId);
  if (!Number.isFinite(id)) return null;

  const fallback = FALLBACK_MATCHES.find((m) => m.id === id);
  if (fallback) return enrichMatch(fallback);

  const ticker = await getTickerMatches();
  const fromTicker = ticker.find((m) => m.id === id);
  if (fromTicker) return fromTicker;

  for (const league of Object.values(LEAGUES)) {
    for (const tab of ['live', 'upcoming', 'results', 'all'] as const) {
      const matches = await getLiveMatches(league.id, tab);
      const found = matches.find((m) => m.id === id);
      if (found) return found;
    }
  }

  return null;
}

/** CMS match detail with fallback from cached/live match lists when fixture API misses. */
export const getMatchDetailPayload = cache(async (fixtureId: string): Promise<MatchDetailPayload> => {
  const cms = await fetchMatchDetailPayload(fixtureId);
  if (cms.fixture) return cms;

  const known = await findKnownLiveMatch(fixtureId);
  if (known) return buildMatchDetailFromLiveMatch(known);

  return cms;
});

// ---------- Fallback Data (used when no API token / CMS) ----------

function enrichMatch(m: LiveMatch): LiveMatch {
  return {
    ...m,
    homeCrest: m.homeCrest ?? resolveTeamBrand(m.homeTeam).crest,
    awayCrest: m.awayCrest ?? resolveTeamBrand(m.awayTeam).crest,
  };
}

function enrichMatches(list: LiveMatch[]): LiveMatch[] {
  return list.map(enrichMatch);
}

const FALLBACK_STANDINGS: StandingRow[] = [
  { position: 1, team: 'Hà Nội FC', teamShort: 'Hà Nội', played: 26, won: 18, draw: 5, lost: 3, goalDifference: 22, points: 59 },
  { position: 2, team: 'Hoàng Anh Gia Lai', teamShort: 'HAGL', played: 26, won: 15, draw: 6, lost: 5, goalDifference: 14, points: 51 },
  { position: 3, team: 'Viettel FC', teamShort: 'Viettel', played: 26, won: 14, draw: 7, lost: 5, goalDifference: 12, points: 49 },
  { position: 4, team: 'Becamex Bình Dương', teamShort: 'Bình Dương', played: 26, won: 13, draw: 6, lost: 7, goalDifference: 8, points: 45 },
  { position: 5, team: 'SHB Đà Nẵng', teamShort: 'Đà Nẵng', played: 26, won: 12, draw: 7, lost: 7, goalDifference: 5, points: 43 },
  { position: 6, team: 'Sông Lam Nghệ An', teamShort: 'SLNA', played: 26, won: 11, draw: 8, lost: 7, goalDifference: 3, points: 41 },
  { position: 7, team: 'Thanh Hóa FC', teamShort: 'Thanh Hóa', played: 26, won: 10, draw: 8, lost: 8, goalDifference: 1, points: 38 },
  { position: 8, team: 'Hải Phòng FC', teamShort: 'Hải Phòng', played: 26, won: 9, draw: 9, lost: 8, goalDifference: -2, points: 36 },
];

const FALLBACK_MATCHES: LiveMatch[] = [
  {
    id: 1,
    competition: 'V.League 1',
    homeTeam: 'Hà Nội FC',
    awayTeam: 'Viettel FC',
    homeCrest: 'https://media.api-sports.io/football/teams/3670.png',
    awayCrest: 'https://media.api-sports.io/football/teams/3672.png',
    homeScore: 2,
    awayScore: 1,
    status: 'FINISHED',
    utcDate: new Date().toISOString(),
  },
  {
    id: 2,
    competition: 'V.League 1',
    homeTeam: 'HAGL',
    awayTeam: 'Becamex Bình Dương',
    homeCrest: 'https://media.api-sports.io/football/teams/3668.png',
    awayCrest: 'https://media.api-sports.io/football/teams/3665.png',
    homeScore: 1,
    awayScore: 1,
    status: 'FT',
    utcDate: new Date().toISOString(),
  },
  {
    id: 3,
    competition: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Man City',
    homeCrest: 'https://crests.football-data.org/57.png',
    awayCrest: 'https://crests.football-data.org/65.png',
    homeScore: 2,
    awayScore: 2,
    status: 'FINISHED',
    utcDate: new Date().toISOString(),
  },
];

const FALLBACK_SCORERS: TopScorer[] = [
  { name: 'Nguyễn Văn Toàn', team: 'HAGL', goals: 14 },
  { name: 'Rafaelson', team: 'Hà Nội FC', goals: 12 },
  { name: 'Đinh Thanh Bình', team: 'Viettel', goals: 11 },
  { name: 'Tô Văn Vũ', team: 'Bình Dương', goals: 10 },
  { name: 'Nguyễn Tiến Linh', team: 'Bình Định', goals: 9 },
];

const FALLBACK_FIFA_RANKINGS: FifaRanking[] = [
  { rank: 1, team: 'Argentina', points: 1883 },
  { rank: 2, team: 'France', points: 1859 },
  { rank: 3, team: 'England', points: 1813 },
  { rank: 4, team: 'Brazil', points: 1785 },
  { rank: 5, team: 'Belgium', points: 1736 },
  { rank: 6, team: 'Portugal', points: 1728 },
  { rank: 7, team: 'Netherlands', points: 1694 },
  { rank: 8, team: 'Spain', points: 1687 },
  { rank: 9, team: 'Italy', points: 1657 },
  { rank: 10, team: 'Croatia', points: 1643 },
  { rank: 96, team: 'Vietnam', points: 1120 },
];
