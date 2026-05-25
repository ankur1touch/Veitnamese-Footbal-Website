'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRankings } from '@/store/features/rankingsSlice';
import { fetchMatches } from '@/store/features/matchesSlice';
import { fetchNewsByCategory } from '@/store/features/newsSlice';
import { StandingsTable } from '@/components/sidebar/StandingsTable';
import { TopScorersWidget } from '@/components/sidebar/TopScorersWidget';
import { MatchCardRow } from '@/components/matches/MatchCardRow';
import { NewsCard } from '@/components/home/NewsCard';
import { Skeleton } from '@/components/ui/Skeleton';

interface LeagueHubClientProps {
  leagueId: number;
  leagueName: string;
  newsTag: string;
}

export function LeagueHubClient({ leagueId, leagueName, newsTag }: LeagueHubClientProps) {
  const dispatch = useAppDispatch();
  const t = useTranslations('league');
  const { status: rankStatus } = useAppSelector((s) => s.rankings);
  const { matches, status: matchStatus } = useAppSelector((s) => s.matches);
  const { articles, status: newsStatus } = useAppSelector((s) => s.news);

  const leagueIdStr = String(leagueId);

  useEffect(() => {
    void dispatch(fetchRankings({ leagueId: leagueIdStr }));
    void dispatch(fetchMatches({ leagueId: leagueIdStr, tab: 'upcoming' }));
    void dispatch(fetchNewsByCategory(newsTag));
  }, [dispatch, leagueIdStr, newsTag]);

  return (
    <div className="container-fh py-6">
      <header className="mb-8 border-l-4 border-brand-red pl-4">
        <h1 className="font-display text-3xl font-extrabold text-brand-navy sm:text-4xl">
          {leagueName}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t('newsTitle', { league: leagueName })}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          <section>
            <h2 className="mb-4 font-display text-xl font-extrabold text-brand-navy">
              {t('newsTitle', { league: leagueName })}
            </h2>
            {newsStatus === 'loading' && (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            )}
            {newsStatus === 'succeeded' && (
              <div className="grid gap-4 sm:grid-cols-2">
                {articles.slice(0, 6).map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
                {articles.length === 0 && (
                  <p className="text-sm text-slate-500">No news available for this league.</p>
                )}
              </div>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-extrabold text-brand-navy">{t('matchesTitle')}</h2>
              <Link href="/tran-dau" className="text-sm font-bold text-brand-red hover:underline">
                View all
              </Link>
            </div>
            {matchStatus === 'loading' && <Skeleton className="h-40 w-full rounded-xl" />}
            {matchStatus === 'succeeded' && matches.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-card">
                {matches.slice(0, 5).map((m) => (
                  <MatchCardRow key={m.id} match={m} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-4">
          {rankStatus === 'loading' ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <>
              <StandingsTable autoFetch={false} />
              <TopScorersWidget autoFetch={false} />
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
