'use client';

import { useTranslations } from 'next-intl';
import { Tag } from '@/components/ui/Tag';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { NewsThumbnail } from '@/components/ui/NewsThumbnail';
import { NewsItemLink } from '@/components/news/NewsItemLink';
import type { NewsItem } from '@/lib/types';

interface HeroCardProps {
  item: NewsItem;
}

export function HeroCard({ item }: HeroCardProps) {
  const t = useTranslations('home');

  return (
    <NewsItemLink
      item={item}
      className="group bdh-card-light grid overflow-hidden sm:grid-cols-5 hover:shadow-card-hover transition-shadow"
    >
      {/* Image panel — left */}
      <div className="relative sm:col-span-3 aspect-[16/10] sm:aspect-auto sm:min-h-[320px] bg-brand-navy overflow-hidden">
        <NewsThumbnail
          src={item.image}
          tag={String(item.tag ?? '')}
          seed={item.id}
          className="absolute inset-0 h-full w-full"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />
        {item.exclusive && (
          <span className="absolute top-4 left-4 tag-pill bg-brand-gold text-brand-navy">
            {t('exclusive')}
          </span>
        )}
      </div>

      {/* Content panel — right, red accent */}
      <div className="sm:col-span-2 flex flex-col justify-between bg-brand-navy p-6 sm:p-8 border-t-4 sm:border-t-0 sm:border-l-4 border-brand-red">
        <div>
          {item.tag && <Tag label={String(item.tag)} className="mb-3" />}
          <h2 className="font-display text-xl font-extrabold leading-tight text-white text-balance sm:text-2xl lg:text-3xl group-hover:text-brand-gold transition-colors">
            {item.title}
          </h2>
        </div>
        <div className="mt-4">
          {item.excerpt && (
            <p className="text-sm text-white/70 line-clamp-3 mb-3">{item.excerpt}</p>
          )}
          <p className="text-xs text-white/50 font-medium uppercase tracking-wide">
            {item.author && <span>{item.author} · </span>}
            <RelativeTime date={item.pubDate} className="inline" />
          </p>
        </div>
      </div>
    </NewsItemLink>
  );
}
