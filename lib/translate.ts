/**
 * Server-only translation utilities using the Google free endpoint.
 * Never import this from client components.
 */

const NATIVE_LOCALE = 'vi';
const GOOGLE_TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';
const CHUNK_SIZE = 10;

function buildTranslateUrl(text: string, targetLang: string, sourceLang: string): string {
  const url = new URL(GOOGLE_TRANSLATE_URL);
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', sourceLang);
  url.searchParams.set('tl', targetLang);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);
  return url.toString();
}

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang = 'auto',
): Promise<string> {
  if (!text?.trim()) return text;
  if (targetLang === NATIVE_LOCALE) return text;

  try {
    const res = await fetch(buildTranslateUrl(text, targetLang, sourceLang), {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return text;

    // Response shape: [ [ [chunk, original], ... ], null, ... ]
    const data = (await res.json()) as Array<unknown>;
    const chunks = data[0] as Array<[string, string]>;
    return chunks.map((c) => c[0]).join('');
  } catch {
    return text;
  }
}

export async function translateBatch(
  texts: string[],
  targetLang: string,
  sourceLang = 'auto',
): Promise<string[]> {
  if (targetLang === NATIVE_LOCALE) return texts;
  if (texts.length === 0) return texts;

  const results: string[] = new Array(texts.length);

  for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
    const chunkIndices = Array.from(
      { length: Math.min(CHUNK_SIZE, texts.length - i) },
      (_, k) => i + k,
    );

    const translated = await Promise.all(
      chunkIndices.map((idx) => translateText(texts[idx], targetLang, sourceLang)),
    );

    chunkIndices.forEach((idx, pos) => {
      results[idx] = translated[pos];
    });
  }

  return results;
}
