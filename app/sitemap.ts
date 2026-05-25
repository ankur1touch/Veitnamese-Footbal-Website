import type { MetadataRoute } from 'next';
import { getAllArticleSlugs } from '@/lib/mdx';

const STATIC_PATHS = ['', '/tin-tuc', '/world-cup', '/tran-dau', '/bang-xep-hang', '/cau-thu', '/v-league', '/ngoai-hang-anh'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://bongdahom.net';
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'hourly',
    priority: path === '' ? 1 : 0.7,
  }));

  const slugs = await getAllArticleSlugs('vi');
  const articleEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/tin-tuc/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries];
}
