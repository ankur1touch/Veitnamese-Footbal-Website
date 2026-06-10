import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import {
  fetchBanthangVnArticleBySlug,
  banthangVnThumb,
} from '@/lib/banthangVnApi';
import { CmsArticlePage } from '@/components/cms/CmsArticlePage';

export const revalidate = 60;

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchBanthangVnArticleBySlug(slug);
  if (!article) return {};

  const thumb = banthangVnThumb(article);

  return {
    title: article.title,
    description: article.summary || article.description,
    openGraph: {
      title: article.title,
      description: article.summary || article.description,
      type: 'article',
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      images: thumb ? [{ url: thumb }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary || article.description,
      images: thumb ? [thumb] : [],
    },
  };
}

export default async function BaiVietPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await fetchBanthangVnArticleBySlug(slug);
  if (!article) notFound();

  return <CmsArticlePage slug={slug} locale={locale} />;
}
