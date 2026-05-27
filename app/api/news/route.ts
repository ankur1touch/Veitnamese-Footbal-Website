import { NextResponse } from 'next/server';
import { getAggregatedNews } from '@/lib/rss';
import { getArticlesAsNewsItems } from '@/lib/mdx';
import { isFootballNews } from '@/lib/football-news-filter';
import { newsImageQualityScore } from '@/lib/news-images';
import type { NewsItem } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function buildPayload(category?: string, locale = 'vi'): Promise<NewsItem[]> {
  const [rss, internal] = await Promise.all([
    getAggregatedNews(),
    getArticlesAsNewsItems(locale),
  ]);

  const merged: NewsItem[] = [...internal, ...rss]
    .filter(isFootballNews)
    .sort((a, b) => {
      const scoreDiff = newsImageQualityScore(b) - newsImageQualityScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    });

  if (!category) return merged;

  const lower = category.toLowerCase();
  return merged.filter((n) => String(n.tag ?? '').toLowerCase().includes(lower));
}

export async function POST(req: Request) {
  try {
    let category: string | undefined;
    let locale = 'vi';
    try {
      const body = await req.json();
      if (body && typeof body === 'object') {
        if (typeof body.category === 'string') category = body.category;
        if (typeof body.locale === 'string' && (body.locale === 'vi' || body.locale === 'en')) {
          locale = body.locale;
        }
      }
    } catch {
    }

    const items = await buildPayload(category, locale);
    return NextResponse.json(items, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error('[/api/news] error', err);
    return NextResponse.json({ error: 'Failed to load news' }, { status: 500 });
  }
}

export async function GET() {
  const items = await buildPayload();
  return NextResponse.json(items);
}
