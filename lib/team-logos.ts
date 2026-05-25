/** Known team crest URLs and fallback colors for display when API omits logos. */

interface TeamBrand {
  crest?: string;
  color: string;
  abbr: string;
}

const TEAM_BRANDS: Record<string, TeamBrand> = {
  'hà nội fc': { crest: 'https://media.api-sports.io/football/teams/3670.png', color: '#4A148C', abbr: 'HN' },
  'ha noi fc': { crest: 'https://media.api-sports.io/football/teams/3670.png', color: '#4A148C', abbr: 'HN' },
  'viettel fc': { crest: 'https://media.api-sports.io/football/teams/3672.png', color: '#C8102E', abbr: 'VT' },
  'viettel': { crest: 'https://media.api-sports.io/football/teams/3672.png', color: '#C8102E', abbr: 'VT' },
  'hagl': { crest: 'https://media.api-sports.io/football/teams/3668.png', color: '#1B5E20', abbr: 'HG' },
  'hoàng anh gia lai': { crest: 'https://media.api-sports.io/football/teams/3668.png', color: '#1B5E20', abbr: 'HG' },
  'bình dương': { crest: 'https://media.api-sports.io/football/teams/3665.png', color: '#0D47A1', abbr: 'BD' },
  'becamex bình dương': { crest: 'https://media.api-sports.io/football/teams/3665.png', color: '#0D47A1', abbr: 'BD' },
  'shb đà nẵng': { crest: 'https://media.api-sports.io/football/teams/3666.png', color: '#E65100', abbr: 'DN' },
  'sông lam nghệ an': { crest: 'https://media.api-sports.io/football/teams/3671.png', color: '#00695C', abbr: 'SL' },
  'thanh hóa fc': { color: '#1565C0', abbr: 'TH' },
  'hải phòng fc': { color: '#283593', abbr: 'HP' },
  'arsenal': { crest: 'https://crests.football-data.org/57.png', color: '#EF0107', abbr: 'ARS' },
  'man city': { crest: 'https://crests.football-data.org/65.png', color: '#6CABDD', abbr: 'MCI' },
  'manchester city': { crest: 'https://crests.football-data.org/65.png', color: '#6CABDD', abbr: 'MCI' },
  'liverpool': { crest: 'https://crests.football-data.org/64.png', color: '#C8102E', abbr: 'LIV' },
  'chelsea': { crest: 'https://crests.football-data.org/61.png', color: '#034694', abbr: 'CHE' },
  'manchester united': { crest: 'https://crests.football-data.org/66.png', color: '#DA291C', abbr: 'MUN' },
  'tottenham': { crest: 'https://crests.football-data.org/73.png', color: '#132257', abbr: 'TOT' },
};

const LEAGUE_ICONS: Record<string, { crest?: string; color: string; abbr: string }> = {
  'v.league 1': { color: '#D32F2F', abbr: 'VL' },
  'v.league': { color: '#D32F2F', abbr: 'VL' },
  'premier league': { crest: 'https://crests.football-data.org/PL.png', color: '#3D195B', abbr: 'PL' },
  'champions league': { crest: 'https://crests.football-data.org/CL.png', color: '#0E1E5B', abbr: 'UCL' },
};

function normalize(name: string): string {
  return name.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export function resolveTeamBrand(teamName: string, existingCrest?: string): TeamBrand {
  const key = normalize(teamName);
  const brand = TEAM_BRANDS[key] ?? TEAM_BRANDS[teamName.toLowerCase()];
  if (brand) {
    return { ...brand, crest: existingCrest ?? brand.crest };
  }
  const words = teamName.trim().split(/\s+/);
  const abbr = words.length >= 2
    ? (words[0].slice(0, 1) + words[1].slice(0, 1)).toUpperCase()
    : teamName.slice(0, 2).toUpperCase();
  return {
    crest: existingCrest,
    color: '#475569',
    abbr,
  };
}

export function resolveLeagueBrand(competition: string): { crest?: string; color: string; abbr: string } {
  const key = normalize(competition);
  return LEAGUE_ICONS[key] ?? { color: '#D32F2F', abbr: competition.slice(0, 2).toUpperCase() };
}
