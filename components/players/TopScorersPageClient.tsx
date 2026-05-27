'use client';

import { useEffect } from 'react';
import { PlayerAvatar } from '@/components/ui/PlayerAvatar';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRankings } from '@/store/features/rankingsSlice';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';

export function TopScorersPageClient() {
  const dispatch = useAppDispatch();
  const t = useTranslations('nav');
  const tSide = useTranslations('sidebar');
  const tStates = useTranslations('states');
  const { topScorers, status, error } = useAppSelector((s) => s.rankings);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchRankings());
    }
  }, [dispatch, status]);

  return (
    <div className="container-fh py-6">
      <h1 className="mb-2 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl">
        {t('players')}
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        {tSide('topScorers')} · La Liga
      </p>

      {status === 'loading' && (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {status === 'failed' && (
        <ErrorState
          title={tStates('errorTitle')}
          message={error ?? tStates('errorMessage')}
          retryLabel={tStates('retry')}
          onRetry={() => void dispatch(fetchRankings())}
        />
      )}

      {status === 'succeeded' && topScorers.length === 0 && (
        <EmptyState message={tStates('emptyMessage')} />
      )}

      {status === 'succeeded' && topScorers.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-card">
          <ul className="divide-y divide-brand-border">
            {topScorers.map((s, idx) => (
              <li
                key={`${s.playerId ?? s.name}-${idx}`}
                className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-brand-surface sm:px-5"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-lg font-extrabold tabular-nums ${
                    idx < 3 ? 'bg-brand-red text-white' : 'bg-brand-surface text-brand-navy'
                  }`}
                >
                  {idx + 1}
                </span>
                <PlayerAvatar name={s.name} photo={s.photo} teamLogo={s.crest} size="sm" className="!h-12 !w-12" />
                <div className="min-w-0 flex-1">
                  {s.playerId ? (
                    <Link
                      href={{ pathname: '/cau-thu/[id]', params: { id: String(s.playerId) } }}
                      className="truncate font-bold text-brand-navy hover:text-brand-red block"
                    >
                      {s.name}
                    </Link>
                  ) : (
                    <p className="truncate font-bold text-brand-navy">{s.name}</p>
                  )}
                  <p className="truncate text-sm text-slate-500">
                    {s.teamId ? (
                      <Link href={{ pathname: '/doi-bong/[id]', params: { id: String(s.teamId) } }} className="hover:text-brand-red">
                        {s.team}
                      </Link>
                    ) : (
                      s.team
                    )}
                  </p>
                </div>
                <span className="font-display text-2xl font-extrabold tabular-nums text-brand-red">
                  {s.goals}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TopScorersPageClient;
