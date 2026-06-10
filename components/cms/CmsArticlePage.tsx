import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Eye, User, Globe, Users, Tag as TagIcon } from 'lucide-react';
import {
  fetchBanthangVnArticleBySlug,
  fetchBanthangVnArticlesByEndpoint,
  localizeArticle,
  localizeArticles,
  banthangVnThumb,
  type BanthangVnArticle,
  type BanthangVnEndpointName,
} from '@/lib/banthangVnApi';
import { markdownToHtml } from '@/lib/markdown';
import { CmsArticleBody } from '@/components/cms/CmsArticleBody';
import { CmsArticleCard } from '@/components/cms/CmsArticleCard';
import { VideoSection } from '@/components/cms/VideoSection';
import { ShareBar } from '@/components/cms/ShareBar';
import { Tag } from '@/components/ui/Tag';
import { RelativeTime } from '@/components/ui/RelativeTime';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1574629810360-7efbbe195778?w=800&q=80';

interface CmsArticlePageProps {
  slug: string;
  locale?: string;
}

export async function CmsArticlePage({ slug, locale = 'vi' }: CmsArticlePageProps) {
  const raw = await fetchBanthangVnArticleBySlug(slug);
  if (!raw) notFound();

  const article = await localizeArticle(raw, locale);

  const endpoint = article.endpointAssignments?.[0]?.name as BanthangVnEndpointName | undefined;

  let related: BanthangVnArticle[] = [];
  if (endpoint) {
    const res = await fetchBanthangVnArticlesByEndpoint(endpoint, { limit: 5 });
    const rawRelated = (res?.data ?? []).filter((a) => a.slug !== slug).slice(0, 4);
    related = await localizeArticles(rawRelated, locale);
  }

  const thumb = banthangVnThumb(article) || FALLBACK_IMG;
  const primaryCategory =
    article.category?.[0] ?? article.endpointAssignments?.[0]?.name ?? '';
  const htmlContent = await markdownToHtml(article.content ?? '');

  // Normalise meta arrays (API returns both teamName and teamNames etc.)
  const teams = [...new Set([...(article.teamName ?? []), ...(article.teamNames ?? [])])].filter(Boolean);
  const players = [...new Set([...(article.playerName ?? []), ...(article.playerNames ?? [])])].filter(Boolean);
  const authors = (article.authorNames ?? []).filter(Boolean);
  const countries = (article.countryName ?? []).filter((c) => c !== 'Global');
  const videoUrls = (article.videoUrls ?? []).filter(Boolean);

  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://banthangvn.com'}/${locale !== 'vi' ? locale + '/' : ''}bai-viet/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary || article.description,
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    image: thumb ? [thumb] : undefined,
    publisher: { '@type': 'Organization', name: 'BanthangVN' },
    inLanguage: locale === 'vi' ? 'vi-VN' : 'en-US',
    ...(authors.length > 0
      ? { author: authors.map((name) => ({ '@type': 'Person', name })) }
      : {}),
  };

  return (
    <article className="container-fh py-8">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Header ── */}
      <header className="mx-auto max-w-3xl">
        {/* Category + tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {primaryCategory && <Tag label={primaryCategory} />}
          {article.tags?.map((tag) => (
            <span
              key={tag}
              className="tag-pill bg-slate-100 text-slate-600 border border-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-brand-navy text-balance sm:text-4xl md:text-5xl">
          {article.title}
        </h1>

        {/* Summary */}
        {article.summary && (
          <p className="mt-4 text-lg leading-relaxed text-slate-600 text-pretty border-l-4 border-brand-red pl-4">
            {article.summary}
          </p>
        )}

        {/* Meta bar */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-brand-border py-3 text-sm text-slate-500">
          {/* Date */}
          <span className="flex items-center gap-1.5">
            <RelativeTime date={article.createdAt} />
          </span>

          {/* Authors */}
          {authors.length > 0 && (
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {authors.join(', ')}
            </span>
          )}

          {/* Views */}
          {(article.views ?? 0) > 0 && (
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              {article.views?.toLocaleString()} lượt xem
            </span>
          )}

          {/* Countries */}
          {countries.length > 0 && (
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              {countries.join(', ')}
            </span>
          )}
        </div>
      </header>

      {/* ── Cover image ── */}
      <div className="mx-auto mt-6 max-w-4xl relative aspect-[16/9] overflow-hidden rounded-xl shadow-card">
        <Image
          src={thumb}
          alt={article.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      {/* ── Article body ── */}
      <CmsArticleBody html={htmlContent} />

      {/* ── Share bar (right after content) ── */}
      <ShareBar url={pageUrl} title={article.title} />

      {/* ── Teams & Players ── */}
      {(teams.length > 0 || players.length > 0) && (
        <div className="mx-auto mt-6 max-w-3xl flex flex-wrap gap-6">
          {teams.length > 0 && (
            <div className="flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 text-brand-red shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  {locale === 'vi' ? 'Đội bóng' : 'Teams'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {teams.map((t) => (
                    <span
                      key={t}
                      className="tag-pill bg-brand-surface text-brand-navy border border-brand-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {players.length > 0 && (
            <div className="flex items-start gap-2">
              <User className="mt-0.5 h-4 w-4 text-brand-red shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  {locale === 'vi' ? 'Cầu thủ' : 'Players'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {players.map((p) => (
                    <span
                      key={p}
                      className="tag-pill bg-brand-surface text-brand-navy border border-brand-border"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tags footer ── */}
      {article.tags && article.tags.length > 0 && (
        <div className="mx-auto mt-5 max-w-3xl flex items-center flex-wrap gap-2">
          <TagIcon className="h-4 w-4 text-slate-400 shrink-0" />
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="tag-pill bg-brand-surface text-brand-navy border border-brand-border"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Video section ── */}
      {videoUrls.length > 0 && (
        <VideoSection
          videoUrls={videoUrls}
          label={locale === 'vi' ? 'Video liên quan' : 'Related Videos'}
        />
      )}

      {/* ── Related articles ── */}
      {related.length > 0 && (
        <section className="mx-auto mt-12 max-w-3xl">
          <h2 className="mb-4 bdh-section-title">
            {locale === 'vi' ? 'Bài viết liên quan' : 'Related Articles'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((a) => (
              <CmsArticleCard key={a._id} article={a} variant="grid" />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
