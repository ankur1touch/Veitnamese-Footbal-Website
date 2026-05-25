const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const decodeCache = new Map<string, { value: string | null; expiresAt: number }>();
const DECODE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isGoogleNewsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'news.google.com' && parsed.pathname.includes('/articles/');
  } catch {
    return false;
  }
}

function getArticleId(sourceUrl: string): string | null {
  try {
    const parts = new URL(sourceUrl).pathname.split('/');
    const idx = parts.indexOf('articles');
    if (idx < 0 || !parts[idx + 1]) return null;
    return parts[idx + 1].split('?')[0];
  } catch {
    return null;
  }
}

function tryOfflineDecode(articleId: string): string | null {
  try {
    let str = Buffer.from(articleId, 'base64').toString('binary');
    const prefix = Buffer.from([0x08, 0x13, 0x22]).toString('binary');
    if (str.startsWith(prefix)) str = str.slice(prefix.length);

    const suffix = Buffer.from([0xd2, 0x01, 0x00]).toString('binary');
    if (str.endsWith(suffix)) str = str.slice(0, -suffix.length);

    const bytes = Uint8Array.from(str, (c) => c.charCodeAt(0));
    const len = bytes[0];
    if (len === undefined) return null;

    str = len >= 0x80 ? str.substring(2, len + 2) : str.substring(1, len + 1);
    if (str.startsWith('http')) return str;
    return null;
  } catch {
    return null;
  }
}

async function fetchDecodeParams(articleId: string): Promise<{ signature: string; timestamp: string } | null> {
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) await sleep(1500 * attempt);

    try {
      const res = await fetch(`https://news.google.com/articles/${articleId}`, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
        redirect: 'follow',
        signal: AbortSignal.timeout(12000),
      });

      if (res.status === 429) continue;
      if (!res.ok) return null;

      const html = await res.text();
      const signature = html.match(/data-n-a-sg="([^"]+)"/)?.[1];
      const timestamp = html.match(/data-n-a-ts="([^"]+)"/)?.[1];
      if (signature && timestamp) return { signature, timestamp };
      return null;
    } catch {
      /* retry */
    }
  }
  return null;
}


async function batchExecuteDecode(
  items: Array<{ articleId: string; signature: string; timestamp: string }>,
): Promise<string[]> {
  if (!items.length) return [];

  const articlesReqs = items.map(({ articleId, signature, timestamp }) => [
    'Fbv4je',
    `["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"${articleId}",${timestamp},"${signature}"]`,
    null,
    'generic',
  ]);

  const payload = JSON.stringify([articlesReqs]);

  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await sleep(2000 * attempt);

    try {
      const res = await fetch('https://news.google.com/_/DotsSplashUi/data/batchexecute?rpcids=Fbv4je', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Referer: 'https://news.google.com/',
          'User-Agent': USER_AGENT,
        },
        body: `f.req=${encodeURIComponent(payload)}`,
        signal: AbortSignal.timeout(15000),
      });

      if (res.status === 429) continue;
      if (!res.ok) return [];

      const text = await res.text();
      const urls = [...text.matchAll(/\\"garturlres\\",\\"(https:[^\\]+)\\"/g)].map((m) =>
        m[1].replace(/\\u003d/g, '=').replace(/\\\//g, '/'),
      );
      return urls;
    } catch {
      /* retry */
    }
  }

  return [];
}

type DecodeJob = { sourceUrl: string; articleId: string };

/** Resolve Google News redirect URLs to publisher article URLs (batched + cached). */
export async function decodeGoogleNewsUrls(sourceUrls: string[]): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();
  const pending: DecodeJob[] = [];

  for (const sourceUrl of sourceUrls) {
    if (!isGoogleNewsUrl(sourceUrl)) {
      results.set(sourceUrl, sourceUrl);
      continue;
    }

    const now = Date.now();
    const cached = decodeCache.get(sourceUrl);
    if (cached && cached.expiresAt > now) {
      results.set(sourceUrl, cached.value);
      continue;
    }

    const articleId = getArticleId(sourceUrl);
    if (!articleId) {
      results.set(sourceUrl, null);
      continue;
    }

    const offline = tryOfflineDecode(articleId);
    if (offline) {
      results.set(sourceUrl, offline);
      decodeCache.set(sourceUrl, { value: offline, expiresAt: now + DECODE_CACHE_TTL_MS });
      continue;
    }

    pending.push({ sourceUrl, articleId });
  }

  // Fetch decode params in small parallel batches to balance speed vs rate limits
  const ready: Array<DecodeJob & { signature: string; timestamp: string }> = [];
  for (let i = 0; i < pending.length; i += 2) {
    const pair = pending.slice(i, i + 2);
    const params = await Promise.all(pair.map((job) => fetchDecodeParams(job.articleId)));
    pair.forEach((job, idx) => {
      const p = params[idx];
      if (p) ready.push({ ...job, ...p });
      else {
        results.set(job.sourceUrl, null);
        decodeCache.set(job.sourceUrl, { value: null, expiresAt: Date.now() + DECODE_CACHE_TTL_MS });
      }
    });
    if (i + 2 < pending.length) await sleep(250);
  }

  // Batch decode publisher URLs (6 per request)
  for (let i = 0; i < ready.length; i += 6) {
    const batch = ready.slice(i, i + 6);
    const urls = await batchExecuteDecode(batch);

    batch.forEach((job, idx) => {
      const publisherUrl = urls[idx] ?? null;
      results.set(job.sourceUrl, publisherUrl);
      decodeCache.set(job.sourceUrl, {
        value: publisherUrl,
        expiresAt: Date.now() + DECODE_CACHE_TTL_MS,
      });
    });

    if (i + 6 < ready.length) await sleep(800);
  }

  return results;
}

/** Resolve a single Google News redirect URL to the original publisher article URL. */
export async function decodeGoogleNewsUrl(sourceUrl: string): Promise<string | null> {
  const map = await decodeGoogleNewsUrls([sourceUrl]);
  return map.get(sourceUrl) ?? null;
}
