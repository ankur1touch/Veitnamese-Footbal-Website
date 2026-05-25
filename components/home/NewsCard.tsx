import { Tag } from '@/components/ui/Tag';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { NewsThumbnail } from '@/components/ui/NewsThumbnail';
import { ExternalLink } from 'lucide-react';
import { NewsItemLink } from '@/components/news/NewsItemLink';
import type { NewsItem } from '@/lib/types';

interface NewsCardProps {
  item: NewsItem;
  variant?: 'list' | 'grid';
}

export function NewsCard({ item, variant = 'list' }: NewsCardProps) {
  if (variant === 'grid') {
    return (
      <NewsItemLink
        item={item}
        className="group snap-start shrink-0 w-56 sm:w-64 bdh-card-light flex flex-col hover:shadow-card-hover transition-shadow"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <NewsThumbnail
            src={item.image}
            tag={String(item.tag ?? '')}
            seed={item.id}
            className="h-full w-full"
          />
          {item.tag && (
            <span className="absolute top-2 left-2 z-10">
              <Tag label={String(item.tag)} />
            </span>
          )}
        </div>
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-display text-sm font-bold leading-snug text-brand-navy group-hover:text-brand-red line-clamp-3 flex-1">
            {item.title}
          </h3>
          <p className="mt-2 text-[10px] text-slate-400 uppercase tracking-wide">
            <RelativeTime date={item.pubDate} className="inline" />
          </p>
        </div>
      </NewsItemLink>
    );
  }

  return (
    <NewsItemLink
      item={item}
      className="group flex gap-4 bdh-accent-border py-3 hover:bg-white/60 -mx-1 px-1 rounded-r-lg transition-colors"
    >
      <NewsThumbnail
        src={item.image}
        tag={String(item.tag ?? '')}
        seed={item.id}
        className="relative h-16 w-16 shrink-0 rounded-lg sm:h-[72px] sm:w-[72px]"
        imgClassName="transition-transform duration-300 group-hover:scale-105"
      />

      <div className="flex flex-1 flex-col justify-center min-w-0">
        <div className="mb-1 flex items-center gap-2">
          {item.tag && <Tag label={String(item.tag)} />}
          {!item.isInternal && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {item.source}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-sm leading-snug text-brand-navy group-hover:text-brand-red line-clamp-2">
          {item.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
          <RelativeTime date={item.pubDate} className="inline" />
          {!item.isInternal && <ExternalLink className="h-3 w-3 ml-1" />}
        </p>
      </div>
    </NewsItemLink>
  );
}
