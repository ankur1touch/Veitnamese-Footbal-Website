import { buildSiteRssFeed } from '@/lib/rss-feed';

export const revalidate = 600;

export async function GET() {
  try {
    const xml = await buildSiteRssFeed();
    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
      },
    });
  } catch (err) {
    console.error('[rss.xml]', (err as Error).message);
    return new Response('RSS feed unavailable', { status: 500 });
  }
}
