'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Tag } from '@/components/ui/Tag';
import type { Article } from '@/lib/types';

export function ArticleHeader({ article }: { article: Article }) {
  const t = useTranslations('article');
  const tHome = useTranslations('home');
  const locale = useLocale();
  const date = new Date(article.date);
  const dateLocale = locale === 'vi' ? 'vi-VN' : 'en-US';

  return (
    <header className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        {article.exclusive && (
          <span className="tag-pill bg-brand-gold text-brand-navy">{tHome('exclusive')}</span>
        )}
        <Tag label={String(article.tag)} />
      </div>
      <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-brand-navy text-balance sm:text-4xl md:text-5xl">
        {article.title}
      </h1>
      {article.excerpt && (
        <p className="mt-4 text-lg leading-relaxed text-slate-600 text-pretty">{article.excerpt}</p>
      )}
      <div className="mt-6 flex items-center gap-4 border-y border-brand-border py-3 text-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red font-bold text-white">
          {article.author
            .split(' ')
            .map((p) => p[0])
            .slice(0, 2)
            .join('')}
        </div>
        <div>
          <p className="font-bold text-brand-navy">{t('by')} {article.author}</p>
          <p className="text-xs text-slate-500">
            {date.toLocaleDateString(dateLocale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </header>
  );
}
