import { NextResponse } from 'next/server';
import { isAllowedPhotoUrl } from '@/lib/player-photo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get('url');
  if (!url || !isAllowedPhotoUrl(url)) {
    return NextResponse.json({ error: 'Invalid photo URL' }, { status: 400 });
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'BongDaHom/1.0',
        Accept: 'image/*',
        Referer: url.includes('fotmob') ? 'https://www.fotmob.com/' : undefined,
      },
      cache: 'force-cache',
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Photo not found' }, { status: upstream.status });
    }

    const bytes = await upstream.arrayBuffer();
    const contentType = upstream.headers.get('content-type') ?? 'image/png';

    return new NextResponse(bytes, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load photo' }, { status: 502 });
  }
}
