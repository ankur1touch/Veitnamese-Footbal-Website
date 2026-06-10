import Parser from 'rss-parser';
import { cache } from 'react';
import type { NewsItem, NewsTag } from './types';
import { slugify } from './utils';
import { createTimedCache } from './memory-cache';
import { enrichNewsImages, extractImageFromHtml, applyQuickImageFallbacks } from './news-images';
import { isFootballNews } from './football-news-filter';

const RSS_CACHE_TTL_MS = 5 * 60 * 1000;
const rssTimedCache = createTimedCache<NewsItem[]>(RSS_CACHE_TTL_MS);
let enrichInflight: Promise<void> | null = null;

function scheduleImageEnrichment(items: NewsItem[]): void {
  if (enrichInflight) return;

  enrichInflight = (async () => {
    try {
      const copy = items.map((item) => ({ ...item }));
      const enriched = await enrichNewsImages(copy, 6);
      rssTimedCache.setCached(enriched);
    } catch (err) {
      console.warn('[rss] Background thumbnail enrichment failed:', (err as Error).message);
    } finally {
      enrichInflight = null;
    }
  })();
}

interface FeedSource {
  name: string;
  url: string;
  homepage: string;
  defaultTag: NewsTag | string;
  lang: 'vi' | 'en';
}

const FEED_SOURCES: FeedSource[] = [
  { name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', homepage: 'https://www.bbc.co.uk/sport/football', defaultTag: 'Premier League', lang: 'en' },
  { name: 'Sky Sports', url: 'https://www.skysports.com/rss/11095', homepage: 'https://www.skysports.com/football', defaultTag: 'Premier League', lang: 'en' },
  { name: 'ESPN FC', url: 'https://www.espn.com/espn/rss/soccer/news', homepage: 'https://www.espn.com/soccer/', defaultTag: 'Premier League', lang: 'en' },
  { name: '90min', url: 'https://www.90min.com/posts.rss', homepage: 'https://www.90min.com', defaultTag: 'Premier League', lang: 'en' },
  { name: 'World Soccer', url: 'https://www.worldsoccer.com/feed', homepage: 'https://www.worldsoccer.com', defaultTag: 'World Cup', lang: 'en' },
  { name: 'Google News VN', url: 'https://news.google.com/rss/search?q=b%C3%B3ng+%C4%91%C3%A1&hl=vi&gl=VN&ceid=VN:vi', homepage: 'https://news.google.com', defaultTag: 'V.League', lang: 'vi' },
  { name: 'Google News VL', url: 'https://news.google.com/rss/search?q=V.League&hl=vi&gl=VN&ceid=VN:vi', homepage: 'https://news.google.com', defaultTag: 'V.League', lang: 'vi' },
  { name: 'Google News WC', url: 'https://news.google.com/rss/search?q=world+cup+2026+football&hl=vi&gl=VN&ceid=VN:vi', homepage: 'https://news.google.com', defaultTag: 'World Cup', lang: 'vi' },
  { name: 'Google News WC EN', url: 'https://news.google.com/rss/search?q=FIFA+World+Cup+2026+football&hl=en&gl=US&ceid=US:en', homepage: 'https://news.google.com', defaultTag: 'World Cup', lang: 'en' },
];

type CustomFeed = { items: CustomItem[] };
type CustomItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  description?: string;
  'content:encoded'?: string;
  enclosure?: { url?: string; type?: string };
  'media:content'?: { $?: { url?: string; type?: string } } | Array<{ $?: { url?: string; type?: string } }>;
  'media:thumbnail'?: { $?: { url?: string } } | Array<{ $?: { url?: string } }>;
  guid?: string;
  categories?: string[];
};

const parser: Parser<CustomFeed, CustomItem> = new Parser({
  timeout: 8000,
  headers: {
    'User-Agent': 'BanThangVN/1.0 (+https://banthangvn.com)',
  },
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
      ['media:group', 'media:group'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'content:encoded'],
    ],
  },
});

function isImageEnclosure(url?: string, type?: string): boolean {
  if (!url) return false;
  if (type?.startsWith('image/')) return true;
  return /\.(jpe?g|png|webp)(\?|$)/i.test(url);
}

function extractImage(item: CustomItem): string | undefined {
  if (item.enclosure?.url && isImageEnclosure(item.enclosure.url, item.enclosure.type)) {
    return item.enclosure.url;
  }

  const mc = item['media:content'];
  if (Array.isArray(mc)) {
    for (const entry of mc) {
      const url = entry?.$?.url;
      if (url && isImageEnclosure(url, entry?.$?.type)) return url;
    }
  } else if (mc?.$?.url && isImageEnclosure(mc.$.url, mc.$.type)) {
    return mc.$.url;
  }

  const mt = item['media:thumbnail'];
  if (Array.isArray(mt) && mt[0]?.$?.url) return mt[0].$.url;
  if (mt && !Array.isArray(mt) && mt.$?.url) return mt.$.url;

  const htmlSources = [item['content:encoded'], item.content, item.description].filter(Boolean);
  for (const html of htmlSources) {
    const fromHtml = extractImageFromHtml(html!);
    if (fromHtml) return fromHtml;
  }

  const snippet = item.contentSnippet ?? '';
  const snippetImg = snippet.match(/https?:\/\/[^\s"']+\.(?:jpg|jpeg|png|webp)/i);
  if (snippetImg?.[0]) return snippetImg[0];

  return undefined;
}

function detectTag(item: CustomItem, defaultTag: string): string {
  const text = `${item.title ?? ''} ${item.contentSnippet ?? ''} ${(item.categories ?? []).join(' ')}`.toLowerCase();

  if (/v\.?league|v-league|bóng đá việt|vietnam/.test(text)) return 'V.League';
  if (/champions|uefa|c1/.test(text)) return 'Champions';
  if (/world cup|fifa|world cup 2026/.test(text)) return 'World Cup';
  if (/premier league|ngoại hạng|epl|arsenal|man city|liverpool|chelsea|manchester/.test(text)) return 'Premier League';
  if (/transfer|chuyển nhượng|fichaje/.test(text)) return 'Transfers';
  if (/messi|ronaldo|mbappé|mbappe|haaland/.test(text)) return 'Premier League';
  return defaultTag;
}

function parseRssDate(raw?: string): string {
  if (!raw?.trim()) return new Date().toISOString();

  const direct = Date.parse(raw);
  if (!Number.isNaN(direct)) {
    try {
      return new Date(direct).toISOString();
    } catch {
      /* fall through */
    }
  }

  // Some feeds omit timezone — treat as UTC
  const normalized = raw.trim().replace(/\s+/g, ' ');
  const utcAttempt = Date.parse(`${normalized} UTC`);
  if (!Number.isNaN(utcAttempt)) {
    try {
      return new Date(utcAttempt).toISOString();
    } catch {
      /* fall through */
    }
  }

  return new Date().toISOString();
}

function mapFeedItem(item: CustomItem, source: FeedSource, idx: number): NewsItem | null {
  try {
    const title = item.title?.trim() || 'Untitled';
    const link = item.link || source.homepage;
    const candidate: NewsItem = {
      id: item.guid || `${source.name}-${idx}-${slugify(title)}`,
      title,
      excerpt: item.contentSnippet?.slice(0, 240),
      url: link,
      image: extractImage(item),
      source: source.name,
      sourceUrl: source.homepage,
      pubDate: parseRssDate(item.pubDate),
      tag: detectTag(item, source.defaultTag),
      isInternal: false,
    };

    if (!isFootballNews(candidate)) {
      return null;
    }

    return candidate;
  } catch (err) {
    console.warn(`[rss] Skipped item in ${source.name}:`, (err as Error).message);
    return null;
  }
}

async function fetchFeed(source: FeedSource): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const limit = source.name.includes('Google') ? 10 : 20;
    return (feed.items || [])
      .slice(0, limit)
      .map((item, idx) => mapFeedItem(item, source, idx))
      .filter((item): item is NewsItem => item !== null);
  } catch (err) {
    console.warn(`[rss] Failed ${source.name}:`, (err as Error).message);
    return [];
  }
}

async function fetchAllFeedsRaw(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(FEED_SOURCES.map(fetchFeed));
  const all = results
    .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .filter(isFootballNews);

  const seen = new Set<string>();
  const deduped = all.filter((item) => {
    const key = slugify(item.title).slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  deduped.sort((a, b) => {
    const ta = Date.parse(a.pubDate);
    const tb = Date.parse(b.pubDate);
    return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta);
  });

  const quick = applyQuickImageFallbacks(deduped);
  scheduleImageEnrichment(quick);
  return quick;
}

export const getAggregatedNews = cache(async (): Promise<NewsItem[]> => {
  return rssTimedCache(fetchAllFeedsRaw);
});

export async function getBreakingNews(limit = 6): Promise<NewsItem[]> {
  const news = await getAggregatedNews();
  return news.slice(0, limit);
}

export async function getNewsByTag(tag: string, limit = 20): Promise<NewsItem[]> {
  const news = await getAggregatedNews();
  const lower = tag.toLowerCase();
  return news.filter((n) => String(n.tag ?? '').toLowerCase().includes(lower)).slice(0, limit);
}

export async function getLatestNews(limit = 12): Promise<NewsItem[]> {
  const news = await getAggregatedNews();
  return news.slice(0, limit);
}
