/** Reject non-football stories from mixed or mis-tagged RSS feeds. */

const NON_FOOTBALL_URL_PATHS = [
  '/tennis/',
  '/boxing/',
  '/fight/',
  '/f1/',
  '/formula-one/',
  '/formula1/',
  '/motorsport/',
  '/golf/',
  '/cricket/',
  '/rugby-union/',
  '/rugby-league/',
  '/rugby/',
  '/basketball/',
  '/nba/',
  '/nfl/',
  '/american-football/',
  '/baseball/',
  '/hockey/',
  '/ice-hockey/',
  '/cycling/',
  '/darts/',
  '/snooker/',
  '/mma/',
  '/ufc/',
  '/motogp/',
  '/athletics/',
  '/swimming/',
  '/rowing/',
  '/sailing/',
  '/winter-sports/',
  '/esports/',
  '/netball/',
  '/volleyball/',
  '/horse-racing/',
  '/greyhound-racing/',
];

const NON_FOOTBALL_KEYWORDS = [
  'tennis',
  'wimbledon',
  'roland garros',
  'french open',
  'australian open',
  'us open',
  'raducanu',
  'djokovic',
  'nadal',
  'federer',
  'alcaraz',
  'sinner',
  'boxing',
  'boxer',
  'heavyweight',
  'to fight on',
  'knockout',
  'formula 1',
  'formula one',
  ' grand prix',
  'verstappen',
  'hamilton',
  'mclaren',
  'red bull racing',
  'mercedes gp',
  'nba ',
  'nfl ',
  'super bowl',
  'cricket',
  'ashes series',
  'rugby union',
  'rugby league',
  'six nations',
  'pga tour',
  ' masters ',
  'the open championship',
  'golf',
  'basketball',
  'motogp',
  'tour de france',
  'wimbledon',
  'olympic swimming',
  'olympic athletics',
];

const FOOTBALL_KEYWORDS = [
  'football',
  'soccer',
  'bóng đá',
  'bong da',
  'fifa',
  'world cup',
  'uefa',
  'champions league',
  'europa league',
  'premier league',
  'la liga',
  'serie a',
  'bundesliga',
  'ligue 1',
  'v-league',
  'v.league',
  'vleague',
  'ngoại hạng',
  'ngoai hang',
  'transfer',
  'chuyển nhượng',
  'goal',
  'penalty',
  'manager',
  'striker',
  'midfielder',
  'defender',
  'goalkeeper',
  'messi',
  'ronaldo',
  'mbappé',
  'mbappe',
  'haaland',
  'salah',
  'de bruyne',
  'bellingham',
  'vinícius',
  'vinicius',
  'đtqg',
  'đội tuyển',
  'doi tuyen',
  'vietnam',
  'việt nam',
  'viet nam',
  'arsenal',
  'chelsea',
  'liverpool',
  'manchester',
  'tottenham',
  'barcelona',
  'real madrid',
  'bayern',
  'psg',
  'juventus',
  'inter milan',
  'ac milan',
  'manchester city',
  'manchester united',
];

function normalizeText(item: { title?: string; excerpt?: string; tag?: unknown }): string {
  return `${item.title ?? ''} ${item.excerpt ?? ''} ${String(item.tag ?? '')}`.toLowerCase();
}

function urlPath(url: string): string {
  try {
    return new URL(url).pathname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

export function isFootballNews(item: {
  title?: string;
  excerpt?: string;
  url?: string;
  tag?: unknown;
  isInternal?: boolean;
}): boolean {
  if (item.isInternal) return true;

  const url = (item.url ?? '').toLowerCase();
  const path = urlPath(url);
  if (NON_FOOTBALL_URL_PATHS.some((segment) => path.includes(segment))) {
    return false;
  }

  const text = normalizeText(item);

  if (NON_FOOTBALL_KEYWORDS.some((keyword) => text.includes(keyword))) {
    return false;
  }

  // Football-only URL paths are always accepted.
  if (
    url.includes('/football/') ||
    url.includes('/soccer/') ||
    url.includes('sport/football') ||
    url.includes('espn.com/soccer')
  ) {
    return true;
  }

  // Google News football queries — accept unless blocked above.
  if (url.includes('news.google.com')) {
    return FOOTBALL_KEYWORDS.some((keyword) => text.includes(keyword));
  }

  // Mixed feeds: require at least one football signal.
  return FOOTBALL_KEYWORDS.some((keyword) => text.includes(keyword));
}
