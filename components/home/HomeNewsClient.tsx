'use client';

import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNews } from '@/store/features/newsSlice';
import { HeroCard } from './HeroCard';
import { HeadlineItem } from './HeadlineItem';
import { NewsCard } from './NewsCard';
import { SkeletonCard, Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';

export function HomeNewsClient() {
  const dispatch = useAppDispatch();
  const t = useTranslations('home');
  const tStates = useTranslations('states');
  const { articles, status, error } = useAppSelector((s) => s.news);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchNews());
    }
  }, [dispatch, status]);

  const { hero, headlines, scrollNews, moreNews } = useMemo(() => {
    const heroPick = articles.find((n) => n.exclusive) ?? articles[0];
    const rest = articles.filter((n) => n.id !== heroPick?.id);
    const headlines = rest.slice(0, 5);
    const scrollNews = rest.slice(5, 13);
    const moreNews = rest.slice(13, 21);
    return { hero: heroPick, headlines, scrollNews, moreNews };
  }, [articles]);

  if (status === 'loading' && articles.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <ErrorState
        title={tStates('errorTitle')}
        message={error ?? tStates('errorMessage')}
        onRetry={() => void dispatch(fetchNews())}
        retryLabel={tStates('retry')}
      />
    );
  }

  if (status === 'succeeded' && articles.length === 0) {
    return <EmptyState title={tStates('emptyTitle')} message={tStates('emptyMessage')} />;
  }

  return (
    <div className="space-y-8">
      {/* Bento row: split hero + numbered headlines */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {hero && <HeroCard item={hero} />}
        </div>
        <div className="bdh-card-light p-4">
          <h2 className="bdh-section-title mb-2">{t('trending')}</h2>
          <div>
            {headlines.map((item, i) => (
              <HeadlineItem key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal scroll news grid */}
      {scrollNews.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="bdh-section-title">{t('latestNews')}</h2>
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-1 text-sm font-bold text-brand-red hover:underline"
            >
              {t('seeAll')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="news-scroll-track">
            {scrollNews.map((item) => (
              <NewsCard key={item.id} item={item} variant="grid" />
            ))}
          </div>
        </div>
      )}

      {/* Compact list with accent borders */}
      {moreNews.length > 0 && (
        <div className="bdh-card-light p-4 sm:p-5">
          <h2 className="bdh-section-title mb-3">{t('readMore')}</h2>
          <div className="divide-y divide-brand-border/50">
            {moreNews.map((item) => (
              <NewsCard key={item.id} item={item} variant="list" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeNewsClient;
