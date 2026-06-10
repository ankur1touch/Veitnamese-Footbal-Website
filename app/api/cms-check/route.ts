import { NextResponse } from 'next/server';

/**
 * GET /api/cms-check
 * Debug endpoint — shows exact CMS base URL being used and tests the
 * HomePage endpoint. Remove this file before going to production.
 */
export async function GET() {
  const cmsBase = (
    process.env.NEXT_PUBLIC_CMS_API_URL ?? 'http://localhost:4000/api'
  ).replace(/\/$/, '');

  const testUrl =
    `${cmsBase}/ai-articles?` +
    new URLSearchParams({
      targetWebsite: 'banthangvn.com',
      filterByEndpoint: 'true',
      endpoint: 'HomePage',
      page: '1',
      limit: '3',
    }).toString();

  let status: number | null = null;
  let body: unknown = null;
  let error: string | null = null;

  try {
    const res = await fetch(testUrl, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    status = res.status;
    body = await res.json().catch(() => null);
  } catch (e) {
    error = (e as Error).message;
  }

  return NextResponse.json({
    cmsBase,
    testUrl,
    httpStatus: status,
    error,
    articleCount: Array.isArray((body as Record<string,unknown>)?.data)
      ? ((body as Record<string,unknown>).data as unknown[]).length
      : null,
    firstArticleTitle:
      Array.isArray((body as Record<string,unknown>)?.data) &&
      ((body as Record<string,unknown>).data as Array<Record<string,unknown>>).length > 0
        ? ((body as Record<string,unknown>).data as Array<Record<string,unknown>>)[0]?.title
        : null,
    meta: (body as Record<string,unknown>)?.meta ?? null,
    rawResponse: body,
  });
}
