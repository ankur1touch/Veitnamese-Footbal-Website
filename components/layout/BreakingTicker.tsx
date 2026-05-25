'use client';

import { useTranslations } from 'next-intl';
import { Radio } from 'lucide-react';
import { NewsItemLink } from '@/components/news/NewsItemLink';
import type { NewsItem } from '@/lib/types';

interface BreakingTickerProps {
  items: NewsItem[];
}

export function BreakingTicker({ items }: BreakingTickerProps) {
  const t = useTranslations('ticker');

  if (!items.length) return null;

  const tickerItems = [...items, ...items];

  return (
    <div className="bg-brand-red text-white">
      <div className="container-fh flex items-stretch overflow-hidden">
        <div className="flex shrink-0 items-center gap-2 bg-brand-red-dark px-4 py-2 text-xs font-extrabold uppercase tracking-widest">
          <Radio className="h-3.5 w-3.5 animate-pulse" />
          <span>{t('label')}</span>
        </div>
        <div className="relative flex-1 overflow-hidden border-l border-white/20">
          <div className="ticker-track py-2 text-sm font-medium">
            {tickerItems.map((item, idx) => (
              <NewsItemLink
                key={`${item.id}-${idx}`}
                item={item}
                className="inline-flex items-center gap-2 hover:text-brand-gold transition-colors"
              >
                <span className="font-bold text-brand-gold">▸</span>
                <span>{item.title}</span>
              </NewsItemLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
