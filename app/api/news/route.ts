import { NextResponse } from 'next/server';
import {
  fetchBanthangVnAllSections,
  banthangVnToNewsItem,
} from '@/lib/banthangVnApi';
import type { NewsItem } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function buildPayload(category?: string): Promise<NewsItem[]> {
  const articles = await fetchBanthangVnAllSections(15);
  const items: NewsItem[] = articles.map(banthangVnToNewsItem);

  if (!category) return items;

  const lower = category.toLowerCase();
  return items.filter((n) => String(n.tag ?? '').toLowerCase().includes(lower));
}

export async function POST(req: Request) {
  try {
    let category: string | undefined;
    try {
      const body = await req.json();
      if (body && typeof body === 'object' && typeof body.category === 'string') {
        category = body.category;
      }
    } catch {
      // empty body — ignore
    }

    const items = await buildPayload(category);
    return NextResponse.json(items, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
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
