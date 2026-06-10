import type { MetadataRoute } from 'next';
import { fetchBanthangVnAllSections } from '@/lib/banthangVnApi';

const STATIC_PATHS = [
  '',
  '/tin-tuc',
  '/tran-dau',
  '/bang-xep-hang',
  '/cau-thu',
  '/v-league',
  '/world-cup',
  '/premier-league',
  '/champions-league',
  '/la-liga',
  '/national-teams',
  '/transfers',
  '/analysis',
  '/other',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://banthangvn.com').replace(/\/$/, '');
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'hourly',
    priority: path === '' ? 1 : 0.7,
  }));

  let articleEntries: MetadataRoute.Sitemap = [];
  try {
    const articles = await fetchBanthangVnAllSections(5);
    articleEntries = articles.map((a) => ({
      url: `${base}/bai-viet/${a.slug}`,
      lastModified: new Date(a.updatedAt || a.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch {
    // sitemap still works without CMS articles
  }

  return [...staticEntries, ...articleEntries];
}
