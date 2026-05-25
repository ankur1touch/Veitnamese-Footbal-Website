export const LEAGUES = {
  vleague: { id: 340, name: 'V.League 1', country: 'Vietnam', season: 2025 },
  epl: { id: 39, name: 'Premier League', country: 'England', season: 2024 },
  ucl: { id: 2, name: 'Champions League', country: 'World', season: 2024 },
  laliga: { id: 140, name: 'La Liga', country: 'Spain', season: 2024 },
  bundesliga: { id: 78, name: 'Bundesliga', country: 'Germany', season: 2024 },
  seriea: { id: 135, name: 'Serie A', country: 'Italy', season: 2024 },
  worldcup: { id: 1, name: 'FIFA World Cup 2026', country: 'World', season: 2026 },
} as const;

export type LeagueKey = keyof typeof LEAGUES;

export const DEFAULT_LEAGUE = LEAGUES.vleague;

function getDefaultSeason(): number {
  const raw = process.env.FOOTBALL_API_SEASON;
  if (raw) {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return DEFAULT_LEAGUE.season;
}

export interface LeagueConfig {
  leagueId: number;
  season: number;
  name: string;
  country: string;
}

export function resolveLeague(leagueId?: string | number): LeagueConfig {
  const defaultSeason = getDefaultSeason();
  const id = leagueId != null ? Number(leagueId) : DEFAULT_LEAGUE.id;

  const match = Object.values(LEAGUES).find((l) => l.id === id);
  if (match) {
    return {
      leagueId: match.id,
      season: match.season ?? defaultSeason,
      name: match.name,
      country: match.country,
    };
  }

  return {
    leagueId: DEFAULT_LEAGUE.id,
    season: defaultSeason,
    name: DEFAULT_LEAGUE.name,
    country: DEFAULT_LEAGUE.country,
  };
}

export function getAllLeagues(): LeagueConfig[] {
  const defaultSeason = getDefaultSeason();
  return Object.values(LEAGUES).map((l) => ({
    leagueId: l.id,
    season: l.season ?? defaultSeason,
    name: l.name,
    country: l.country,
  }));
}
