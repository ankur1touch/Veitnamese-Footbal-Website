'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Radio, Calendar, Trophy } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMatches } from '@/store/features/matchesSlice';
import { MatchCardRow } from '@/components/matches/MatchCardRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { resolveLeagueBrand } from '@/lib/team-logos';
import type { LiveMatch } from '@/types';
import { cn } from '@/lib/utils';

type Tab = 'live' | 'upcoming' | 'results';

export function MatchesClient() {
  const dispatch = useAppDispatch();
  const tStates = useTranslations('states');
  const tMatches = useTranslations('matches');
  const tSide = useTranslations('sidebar');
  const { matches, status, error } = useAppSelector((s) => s.matches);
  const [tab, setTab] = useState<Tab>('live');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    void dispatch(fetchMatches({ tab })).finally(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [dispatch, tab]);

  const byCompetition = useMemo(() => {
    return matches.reduce((acc, m) => {
      (acc[m.competition] ??= []).push(m);
      return acc;
    }, {} as Record<string, LiveMatch[]>);
  }, [matches]);

  const liveCount = matches.filter(
    (m) => m.status === 'IN_PLAY' || m.status === 'LIVE',
  ).length;

  const tabs: { id: Tab; label: string; icon: typeof Radio }[] = [
    { id: 'live', label: tMatches('live'), icon: Radio },
    { id: 'upcoming', label: tMatches('upcoming'), icon: Calendar },
    { id: 'results', label: tMatches('results'), icon: Trophy },
  ];

  const loading = !ready || status === 'loading';
  const subtitle = !ready
    ? tMatches('subtitleEmpty')
    : matches.length > 0
      ? liveCount > 0
        ? tMatches('subtitleLive', { count: matches.length, live: liveCount })
        : tMatches('subtitleCount', { count: matches.length })
      : tMatches('subtitleEmpty');

  return (
    <div className="container-fh py-6">
      {/* Hero banner */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-navy via-brand-navy to-brand-red/80 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold/80">
              {tMatches('pageEyebrow')}
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
              {tSide('liveScores')}
            </h1>
            <p className="mt-2 text-sm text-white/70" suppressHydrationWarning>
              {subtitle}
            </p>
          </div>
          {ready && liveCount > 0 ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2 text-xs font-bold uppercase tracking-wide shadow-lg shadow-brand-red/40">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              {tMatches('liveBadge', { count: liveCount })}
            </span>
          ) : null}
        </div>

        {/* Tabs — suppressHydrationWarning: browser extensions inject fdprocessedid on buttons */}
        <div className="mt-6 flex flex-wrap gap-2" role="tablist" suppressHydrationWarning>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              suppressHydrationWarning
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all',
                tab === id
                  ? 'bg-white text-brand-navy shadow-md'
                  : 'bg-white/10 text-white/80 hover:bg-white/20',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {ready && status === 'failed' && (
        <ErrorState
          title={tStates('errorTitleMatches')}
          message={error ?? tStates('errorMessage')}
          retryLabel={tStates('retry')}
          onRetry={() => void dispatch(fetchMatches({ tab }))}
        />
      )}

      {ready && status === 'succeeded' && matches.length === 0 && (
        <EmptyState message={tMatches('noMatchesToday')} />
      )}

      {ready &&
        status === 'succeeded' &&
        Object.entries(byCompetition).map(([comp, list]) => {
          const league = resolveLeagueBrand(comp);
          return (
            <section key={comp} className="mb-8">
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-extrabold text-white shadow-sm"
                  style={{ backgroundColor: league.color }}
                >
                  {league.abbr}
                </span>
                <div className="border-l-4 border-brand-red pl-3">
                  <h2 className="font-display text-lg font-extrabold uppercase tracking-wide text-brand-navy">
                    {comp}
                  </h2>
                  <p className="text-[11px] font-semibold text-slate-400">
                    {tMatches('matchCount', { count: list.length })}
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-card">
                {list.map((m) => (
                  <MatchCardRow key={m.id} match={m} />
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}

export default MatchesClient;
