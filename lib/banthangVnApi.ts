/**
 * API client for the headless CMS — banthangvn.com target website.
 *
 * Critical rules:
 *  - Every LIST request MUST include targetWebsite + filterByEndpoint=true.
 *  - Endpoint spellings are exact CMS names; do not alter them.
 *  - CMS content is already in vi-VN; never translate on the client.
 */

const CMS_BASE =
  (process.env.NEXT_PUBLIC_CMS_API_URL ?? 'http://localhost:4000/api').replace(/\/$/, '');

export const BANTHANG_VN_WEBSITE = 'banthangvn.com';

// ---------- Endpoint name constants ----------

export const BanthangVnEndpoints = {
  HomePage: 'HomePage',
  VLeague: 'V.League',
  PremierLeague: 'Premier League',
  ChampionsLeague: 'Champions League',
  WorldCup: 'World Cup',
  LaLiga: 'La Liga',
  NationalTeams: 'National Teams',
  Transfers: 'Transfers',
  Analysis: 'Analysis',
  Other: 'Other',
} as const;

export type BanthangVnEndpointName =
  (typeof BanthangVnEndpoints)[keyof typeof BanthangVnEndpoints];

// ---------- Route → endpoint map (reuse in nav + data fetching) ----------

export const BanthangVnRouteEndpoint: Record<string, BanthangVnEndpointName> = {
  '/': BanthangVnEndpoints.HomePage,
  '/v-league': BanthangVnEndpoints.VLeague,
  '/premier-league': BanthangVnEndpoints.PremierLeague,
  '/champions-league': BanthangVnEndpoints.ChampionsLeague,
  '/world-cup': BanthangVnEndpoints.WorldCup,
  '/la-liga': BanthangVnEndpoints.LaLiga,
  '/national-teams': BanthangVnEndpoints.NationalTeams,
  '/transfers': BanthangVnEndpoints.Transfers,
  '/analysis': BanthangVnEndpoints.Analysis,
  '/other': BanthangVnEndpoints.Other,
};

// ---------- Vietnamese nav labels ----------

export const BanthangVnNavLabels: Record<string, string> = {
  '/': 'Trang chủ',
  '/v-league': 'V.League',
  '/premier-league': 'Ngoại hạng Anh',
  '/champions-league': 'Champions League',
  '/world-cup': 'World Cup',
  '/la-liga': 'La Liga',
  '/national-teams': 'Đội tuyển',
  '/transfers': 'Chuyển nhượng',
  '/analysis': 'Phân tích',
  '/other': 'Khác',
};

// ---------- Response shapes ----------

export interface BanthangVnArticle {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  content: string;
  category: string[];
  tags?: string[];
  countryName?: string[];
  imageUrls: string[];
  markdownImages?: string[];
  coverImage?: string;
  videoUrls?: string[];
  twitterLinks?: string[];
  teamName?: string[];
  teamNames?: string[];
  playerName?: string[];
  playerNames?: string[];
  authorNames?: string[];
  leagueName?: string[];
  websiteSection?: string;
  targetWebsites: string[];
  endpointAssignments?: { name: string; _id?: string }[];
  seo?: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string[];
  };
  views?: number;
  createdAt: string;
  updatedAt: string;
  scheduledTime?: string;
}

export interface BanthangVnListResponse {
  data: BanthangVnArticle[];
  meta: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

/** Returns coverImage || first imageUrls entry for card thumbnails. */
export function banthangVnThumb(article: BanthangVnArticle): string | undefined {
  return article.coverImage || article.imageUrls?.[0];
}


export function banthangVnToNewsItem(article: BanthangVnArticle): import('@/types').NewsItem {
  const thumb = banthangVnThumb(article);
  const primaryCategory =
    article.category?.[0] ?? article.endpointAssignments?.[0]?.name ?? 'Tin tức';
  return {
    id: article._id,
    title: article.title,
    excerpt: article.summary || article.description,
    url: `/bai-viet/${article.slug}`,
    image: thumb,
    source: 'BanthangVN',
    sourceUrl: `https://${BANTHANG_VN_WEBSITE}`,
    pubDate: article.createdAt,
    tag: primaryCategory,
    isInternal: true,
    slug: article.slug,
  };
}

// ---------- Fetch helpers ----------

interface ListParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  requireImage?: boolean;
  search?: string;
  daysBack?: number;
}

async function cmsGet<T>(path: string, params: Record<string, string | number | boolean | undefined> = {}): Promise<T | null> {
  const url = new URL(`${CMS_BASE}${path.startsWith('/') ? path : `/${path}`}`);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    url.searchParams.set(k, String(v));
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`[banthangVnApi] ${path} → ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[banthangVnApi] error ${path}:`, (err as Error).message);
    return null;
  }
}

/**
 * Fetch articles by CMS endpoint name.
 * Always injects the mandatory targetWebsite + filterByEndpoint params.
 */
export async function fetchBanthangVnArticlesByEndpoint(
  endpoint: BanthangVnEndpointName,
  params: ListParams = {},
): Promise<BanthangVnListResponse | null> {
  const {
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order = 'desc',
    requireImage,
    search,
    daysBack,
  } = params;

  return cmsGet<BanthangVnListResponse>('/ai-articles', {
    targetWebsite: BANTHANG_VN_WEBSITE,
    filterByEndpoint: true, // mandatory — without this, endpoint is ignored
    endpoint,
    page,
    limit,
    sort,
    order,
    ...(requireImage !== undefined ? { requireImage } : {}),
    ...(search ? { search } : {}),
    ...(daysBack !== undefined ? { daysBack } : {}),
  });
}

// ---------- Convenience helpers ----------

export async function fetchBanthangVnHomePage(limit = 9): Promise<BanthangVnListResponse | null> {
  return fetchBanthangVnArticlesByEndpoint(BanthangVnEndpoints.HomePage, { limit });
}

export async function fetchBanthangVnVLeague(
  page = 1,
  limit = 20,
): Promise<BanthangVnListResponse | null> {
  return fetchBanthangVnArticlesByEndpoint(BanthangVnEndpoints.VLeague, { page, limit });
}

export async function fetchBanthangVnPremierLeague(
  page = 1,
  limit = 20,
): Promise<BanthangVnListResponse | null> {
  return fetchBanthangVnArticlesByEndpoint(BanthangVnEndpoints.PremierLeague, { page, limit });
}

export async function fetchBanthangVnChampionsLeague(
  page = 1,
  limit = 20,
): Promise<BanthangVnListResponse | null> {
  return fetchBanthangVnArticlesByEndpoint(BanthangVnEndpoints.ChampionsLeague, { page, limit });
}

export async function fetchBanthangVnWorldCup(
  page = 1,
  limit = 20,
): Promise<BanthangVnListResponse | null> {
  return fetchBanthangVnArticlesByEndpoint(BanthangVnEndpoints.WorldCup, { page, limit });
}

export async function fetchBanthangVnLaLiga(
  page = 1,
  limit = 20,
): Promise<BanthangVnListResponse | null> {
  return fetchBanthangVnArticlesByEndpoint(BanthangVnEndpoints.LaLiga, { page, limit });
}

export async function fetchBanthangVnNationalTeams(
  page = 1,
  limit = 20,
): Promise<BanthangVnListResponse | null> {
  return fetchBanthangVnArticlesByEndpoint(BanthangVnEndpoints.NationalTeams, { page, limit });
}

export async function fetchBanthangVnTransfers(
  page = 1,
  limit = 20,
): Promise<BanthangVnListResponse | null> {
  return fetchBanthangVnArticlesByEndpoint(BanthangVnEndpoints.Transfers, { page, limit });
}

export async function fetchBanthangVnAnalysis(
  page = 1,
  limit = 20,
): Promise<BanthangVnListResponse | null> {
  return fetchBanthangVnArticlesByEndpoint(BanthangVnEndpoints.Analysis, { page, limit });
}

export async function fetchBanthangVnOther(
  page = 1,
  limit = 20,
): Promise<BanthangVnListResponse | null> {
  return fetchBanthangVnArticlesByEndpoint(BanthangVnEndpoints.Other, { page, limit });
}

// ---------- Localisation ----------

const NATIVE_LOCALE = 'vi';

/**
 * Translates title + summary fields of a list of articles when the target
 * locale differs from the native content locale.
 * Uses dynamic import to keep translate.ts out of any client bundle.
 */
export async function localizeArticles(
  articles: BanthangVnArticle[],
  targetLocale: string,
): Promise<BanthangVnArticle[]> {
  if (targetLocale === NATIVE_LOCALE || articles.length === 0) return articles;

  const { translateBatch } = await import('@/lib/translate');

  const titles = articles.map((a) => a.title);
  const summaries = articles.map((a) => a.summary ?? '');

  const [translatedTitles, translatedSummaries] = await Promise.all([
    translateBatch(titles, targetLocale),
    translateBatch(summaries, targetLocale),
  ]);

  return articles.map((a, i) => ({
    ...a,
    title: translatedTitles[i] ?? a.title,
    summary: translatedSummaries[i] ?? a.summary,
  }));
}

/**
 * Translates a single article's title, summary, and full HTML content.
 */
export async function localizeArticle(
  article: BanthangVnArticle,
  targetLocale: string,
): Promise<BanthangVnArticle> {
  if (targetLocale === NATIVE_LOCALE) return article;

  const { translateText } = await import('@/lib/translate');

  const [title, summary, content] = await Promise.all([
    translateText(article.title, targetLocale),
    article.summary ? translateText(article.summary, targetLocale) : Promise.resolve(article.summary),
    article.content ? translateText(article.content, targetLocale) : Promise.resolve(article.content),
  ]);

  return { ...article, title, summary, content };
}

/** GET /api/ai-articles/slug/:slug */
export async function fetchBanthangVnArticleBySlug(
  slug: string,
): Promise<BanthangVnArticle | null> {
  const res = await cmsGet<BanthangVnArticle>(`/ai-articles/slug/${encodeURIComponent(slug)}`);
  return res ?? null;
}

/**
 * Fetches articles from ALL endpoints in parallel and returns them merged,
 * sorted by createdAt desc, deduplicated by _id.
 * Used by /api/news and BreakingTicker to replace RSS feeds completely.
 */
export async function fetchBanthangVnAllSections(limitPerEndpoint = 10): Promise<BanthangVnArticle[]> {
  const endpoints = Object.values(BanthangVnEndpoints);

  const results = await Promise.allSettled(
    endpoints.map((ep) =>
      fetchBanthangVnArticlesByEndpoint(ep as BanthangVnEndpointName, { limit: limitPerEndpoint }),
    ),
  );

  const all: BanthangVnArticle[] = results
    .filter((r): r is PromiseFulfilledResult<BanthangVnListResponse | null> => r.status === 'fulfilled')
    .flatMap((r) => r.value?.data ?? []);

  // Deduplicate by _id, sort newest first
  const seen = new Set<string>();
  return all
    .filter((a) => {
      if (seen.has(a._id)) return false;
      seen.add(a._id);
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
