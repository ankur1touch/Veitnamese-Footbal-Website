import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { getTagFallbackImage } from './news-images';
import type { Article, ArticleFrontmatter, NewsItem } from './types';

const ARTICLES_ROOT = path.join(process.cwd(), 'content', 'articles');

function articlesDir(locale = 'vi'): string {
  return path.join(ARTICLES_ROOT, locale);
}

async function ensureDir(dir: string): Promise<void> {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function readArticleFromDir(slug: string, locale: string): Promise<Article | null> {
  const dir = articlesDir(locale);
  await ensureDir(dir);
  for (const ext of ['.mdx', '.md']) {
    const filepath = path.join(dir, `${slug}${ext}`);
    try {
      const raw = await fs.readFile(filepath, 'utf8');
      const { data, content } = matter(raw);
      const fm = data as ArticleFrontmatter;
      return { ...fm, slug, content };
    } catch {
      continue;
    }
  }
  return null;
}

export async function getAllArticleSlugs(locale = 'vi'): Promise<string[]> {
  const dir = articlesDir(locale);
  await ensureDir(dir);
  const files = await fs.readdir(dir);
  return files
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => f.replace(/\.(mdx|md)$/, ''));
}

/** All slugs across locales (for static generation). */
export async function getAllArticleSlugsAllLocales(): Promise<string[]> {
  const [vi, en] = await Promise.all([getAllArticleSlugs('vi'), getAllArticleSlugs('en')]);
  return [...new Set([...vi, ...en])];
}

export async function getArticleBySlug(slug: string, locale = 'vi'): Promise<Article | null> {
  const localized = await readArticleFromDir(slug, locale);
  if (localized) return localized;
  // Fall back to Vietnamese article when no English translation exists
  if (locale !== 'vi') {
    return readArticleFromDir(slug, 'vi');
  }
  return null;
}

export async function getAllArticles(locale = 'vi'): Promise<Article[]> {
  const slugs = await getAllArticleSlugs(locale);
  const viSlugs = locale === 'vi' ? [] : await getAllArticleSlugs('vi');
  const allSlugs = [...new Set([...slugs, ...viSlugs])];
  const articles = await Promise.all(allSlugs.map((s) => getArticleBySlug(s, locale)));
  return articles
    .filter((a): a is Article => a !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getArticlesAsNewsItems(locale = 'vi'): Promise<NewsItem[]> {
  const articles = await getAllArticles(locale);
  return articles.map((a) => ({
    id: `internal-${a.slug}`,
    title: a.title,
    excerpt: a.excerpt,
    url: `/tin-tuc/${a.slug}`,
    image: a.image || getTagFallbackImage(String(a.tag ?? ''), a.slug),
    source: 'BanThangVN',
    pubDate: new Date(a.date).toISOString(),
    tag: a.tag,
    isInternal: true,
    slug: a.slug,
    author: a.author,
    exclusive: a.exclusive,
  }));
}

export async function getRelatedArticles(
  currentSlug: string,
  tag: string,
  limit = 3,
  locale = 'vi',
): Promise<Article[]> {
  const all = await getAllArticles(locale);
  const sameTag = all.filter((a) => a.slug !== currentSlug && String(a.tag) === String(tag));
  if (sameTag.length >= limit) return sameTag.slice(0, limit);

  const other = all.filter((a) => a.slug !== currentSlug && String(a.tag) !== String(tag));
  return [...sameTag, ...other].slice(0, limit);
}
