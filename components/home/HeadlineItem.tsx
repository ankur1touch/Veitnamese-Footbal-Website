import { RelativeTime } from '@/components/ui/RelativeTime';
import { NewsItemLink } from '@/components/news/NewsItemLink';
import type { NewsItem } from '@/lib/types';

interface HeadlineItemProps {
  item: NewsItem;
  index: number;
}

export function HeadlineItem({ item, index }: HeadlineItemProps) {
  return (
    <NewsItemLink
      item={item}
      className="group flex gap-3 items-start py-3 border-b border-brand-border last:border-0 hover:bg-brand-surface/60 -mx-2 px-2 rounded-lg transition-colors"
    >
      <span className="shrink-0 font-mono text-2xl font-bold text-brand-red/30 group-hover:text-brand-red transition-colors leading-none pt-0.5">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-sm leading-snug text-brand-navy group-hover:text-brand-red line-clamp-2">
          {item.title}
        </h3>
        <p className="mt-1 text-[11px] text-slate-400 uppercase tracking-wide">
          {item.source} · <RelativeTime date={item.pubDate} className="inline" />
        </p>
      </div>
    </NewsItemLink>
  );
}
