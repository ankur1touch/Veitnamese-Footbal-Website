import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Tag } from '@/components/ui/Tag';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { NewsThumbnail } from '@/components/ui/NewsThumbnail';
import type { Article } from '@/lib/types';

interface RelatedNewsProps {
  articles: Article[];
}

export async function RelatedNews({ articles }: RelatedNewsProps) {
  const t = await getTranslations('article');

  if (!articles.length) return null;

  return (
    <section className="mx-auto mt-12 max-w-3xl">
      <h2 className="mb-4 bdh-section-title">{t('relatedNews')}</h2>
      <div className="space-y-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={{ pathname: '/tin-tuc/[slug]', params: { slug: article.slug } }}
            className="group flex gap-4 bdh-card-light p-4 hover:shadow-card-hover transition-shadow"
          >
            <NewsThumbnail
              src={article.image}
              tag={String(article.tag ?? '')}
              seed={article.slug}
              className="h-20 w-28 shrink-0 rounded-md"
            />
            <div className="flex-1 min-w-0">
              <Tag label={String(article.tag)} />
              <h3 className="mt-2 font-display text-base font-bold leading-snug text-brand-navy group-hover:text-brand-red line-clamp-2">
                {article.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                <RelativeTime date={article.date} />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
