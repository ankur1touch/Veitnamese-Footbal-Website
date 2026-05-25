import { decodeGoogleNewsUrl, decodeGoogleNewsUrls, isGoogleNewsUrl } from './google-news-decoder';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const OG_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const ogCache = new Map<string, { value: string | null; expiresAt: number }>();
const ogInflight = new Map<string, Promise<string | null>>();

/** High-quality stock images by topic — used only when RSS + OG scrape find nothing. */
const TAG_FALLBACKS: Record<string, string[]> = {
  'World Cup': [
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80&auto=format&fit=crop',
  ],
  'V.League': [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80&auto=format&fit=crop',
  ],
  'Premier League': [
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508098682722-e99b77432ec0?w=800&q=80&auto=format&fit=crop',
  ],
  Champions: [
    'https://images.unsplash.com/photo-1489944440615-453c172851f6?w=800&q=80&auto=format&fit=crop',
  ],
  Transfers: [
    'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80&auto=format&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80&auto=format&fit=crop',
  ],
};

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = input.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
}

export function getTagFallbackImage(tag: string, seed: string): string {
  const key = Object.keys(TAG_FALLBACKS).find((k) =>
    tag.toLowerCase().includes(k.toLowerCase()),
  );
  const pool = TAG_FALLBACKS[key ?? 'default'] ?? TAG_FALLBACKS.default;
  return pool[hashSeed(seed) % pool.length];
}

export function extractImageFromHtml(html: string): string | undefined {
  if (!html) return undefined;

  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
    /<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      const url = decodeHtmlEntities(match[1].trim());
      if (isValidImageUrl(url)) return url;
    }
  }
  return undefined;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function isValidImageUrl(url: string): boolean {
  if (!url.startsWith('http')) return false;
  if (isGenericGoogleNewsImage(url)) return false;
  if (/logo|icon|avatar|1x1|pixel|spacer|badge/i.test(url)) return false;
  if (/\.(svg|gif)(\?|$)/i.test(url)) return false;
  return true;
}

/** Google News wrapper pages all share this generic newspaper icon. */
export function isGenericGoogleNewsImage(url: string): boolean {
  return (
    url.includes('googleusercontent.com/J6_coFbogxhRI9iM864NL') ||
    url.includes('gstatic.com/gnews/logo') ||
    url.includes('google_news_192')
  );
}

function needsImageEnrichment(
  item: { url: string; image?: string; isInternal?: boolean },
): boolean {
  if (item.isInternal) return false;
  if (!item.image) return true;
  if (isGenericGoogleNewsImage(item.image)) return true;
  // Re-scrape Google News items stuck on Unsplash stock photos
  if (item.url.includes('news.google.com') && item.image.includes('unsplash.com')) return true;
  return false;
}

function upgradeGoogleThumbnail(url: string): string {
  if (!url.includes('googleusercontent.com')) return url;
  return url.replace(/=s0-w\d+/i, '=s0-w800').replace(/=w\d+-h\d+/i, '=w800-h600');
}

async function fetchPublisherOgImage(publisherUrl: string): Promise<string | null> {
  try {
    const pubRes = await fetch(publisherUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });
    if (!pubRes.ok) return null;
    const pubHtml = await pubRes.text();
    const pubImage = extractImageFromHtml(pubHtml);
    return pubImage && isValidImageUrl(pubImage) ? pubImage : null;
  } catch {
    return null;
  }
}

async function fetchGoogleNewsImage(pageUrl: string): Promise<string | null> {
  const publisherUrl = await decodeGoogleNewsUrl(pageUrl);
  if (publisherUrl && !isGoogleNewsUrl(publisherUrl)) {
    const pubImage = await fetchPublisherOgImage(publisherUrl);
    if (pubImage) return pubImage;
  }

  // Last resort: wrapper page (usually generic icon — rejected by isValidImageUrl)
  try {
    const res = await fetch(pageUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const wrapperImage = extractImageFromHtml(html);
    if (wrapperImage && isValidImageUrl(wrapperImage)) {
      return upgradeGoogleThumbnail(wrapperImage);
    }
  } catch {
    /* fall through */
  }

  return null;
}

async function resolveArticleUrl(url: string): Promise<string> {
  if (!isGoogleNewsUrl(url)) return url;
  const decoded = await decodeGoogleNewsUrl(url);
  return decoded && !isGoogleNewsUrl(decoded) ? decoded : url;
}

export async function fetchOgImageForUrl(pageUrl: string): Promise<string | undefined> {
  if (!pageUrl?.startsWith('http')) return undefined;

  const now = Date.now();
  const cached = ogCache.get(pageUrl);
  if (cached && cached.expiresAt > now) {
    if (cached.value && !isGenericGoogleNewsImage(cached.value)) {
      return cached.value;
    }
  }

  let inflight = ogInflight.get(pageUrl);
  if (!inflight) {
    inflight = (async () => {
      try {
        if (pageUrl.includes('news.google.com')) {
          return await fetchGoogleNewsImage(pageUrl);
        }

        const resolved = await resolveArticleUrl(pageUrl);
        const res = await fetch(resolved, {
          headers: {
            'User-Agent': USER_AGENT,
            Accept: 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
          },
          redirect: 'follow',
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) return null;

        const html = await res.text();
        const image = extractImageFromHtml(html);
        return image && isValidImageUrl(image) ? image : null;
      } catch {
        return null;
      }
    })();
    ogInflight.set(pageUrl, inflight);
  }

  const result = await inflight;
  ogInflight.delete(pageUrl);
  ogCache.set(pageUrl, { value: result, expiresAt: Date.now() + OG_CACHE_TTL_MS });
  return result ?? undefined;
}

export async function resolveNewsImage(
  item: { url: string; tag?: string; id: string; image?: string; isInternal?: boolean },
): Promise<string> {
  if (item.isInternal && item.image) return item.image;
  if (item.image && isValidImageUrl(item.image)) return item.image;

  const og = await fetchOgImageForUrl(item.url);
  if (og) return og;

  return getTagFallbackImage(String(item.tag ?? ''), item.id);
}

const ENRICH_TIMEOUT_MS = 18_000;
const MAX_GOOGLE_DECODE = 6;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    sleep(ms).then(() => null),
  ]);
}
/** Batch-enrich RSS items missing thumbnails (concurrency-limited). */
export async function enrichNewsImages<
  T extends { url: string; tag?: string; id: string; image?: string; isInternal?: boolean },
>(items: T[], maxGoogleFetches = MAX_GOOGLE_DECODE): Promise<T[]> {
  await withTimeout(enrichNewsImagesInner(items, maxGoogleFetches), ENRICH_TIMEOUT_MS);
  return finalizeImages(items);
}

async function enrichNewsImagesInner<
  T extends { url: string; tag?: string; id: string; image?: string; isInternal?: boolean },
>(items: T[], maxGoogleFetches: number): Promise<void> {
  const missing = items.filter((i) => needsImageEnrichment(i));
  const googleItems = missing
    .filter((i) => i.url.includes('news.google.com'))
    .slice(0, maxGoogleFetches);
  const otherItems = missing.filter((i) => !i.url.includes('news.google.com')).slice(0, 6);

  if (googleItems.length > 0) {
    const decoded = await decodeGoogleNewsUrls(googleItems.map((i) => i.url));

    const CONCURRENCY = 3;
    const jobs = googleItems
      .map((item) => ({
        item,
        publisherUrl: decoded.get(item.url) ?? null,
      }))
      .filter((j) => j.publisherUrl && !isGoogleNewsUrl(j.publisherUrl));

    for (let i = 0; i < jobs.length; i += CONCURRENCY) {
      const batch = jobs.slice(i, i + CONCURRENCY);
      await Promise.allSettled(
        batch.map(async ({ item, publisherUrl }) => {
          const og = publisherUrl ? await fetchPublisherOgImage(publisherUrl) : null;
          if (og) {
            const idx = items.findIndex((x) => x.id === item.id);
            if (idx >= 0) items[idx] = { ...items[idx], image: og };
          }
        }),
      );
    }
  }

  for (const item of otherItems) {
    const og = await fetchOgImageForUrl(item.url);
    if (og) {
      const idx = items.findIndex((x) => x.id === item.id);
      if (idx >= 0) items[idx] = { ...items[idx], image: og };
    }
  }
}

export function applyQuickImageFallbacks<
  T extends { url: string; tag?: string; id: string; image?: string; isInternal?: boolean },
>(items: T[]): T[] {
  return finalizeImages(items);
}

function finalizeImages<
  T extends { url: string; tag?: string; id: string; image?: string; isInternal?: boolean },
>(items: T[]): T[] {
  return items.map((item) => ({
    ...item,
    image:
      item.image && !isGenericGoogleNewsImage(item.image)
        ? item.image
        : item.isInternal
          ? item.image
          : getTagFallbackImage(String(item.tag ?? ''), item.id),
  }));
}

export function newsImageQualityScore(item: { image?: string }): number {
  if (!item.image) return 0;
  if (isGenericGoogleNewsImage(item.image)) return 1;
  if (item.image.includes('unsplash.com')) return 2;
  return 10;
}
