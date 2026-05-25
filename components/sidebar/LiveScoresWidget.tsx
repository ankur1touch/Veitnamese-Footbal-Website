'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Circle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMatches } from '@/store/features/matchesSlice';
import { DEFAULT_LEAGUE } from '@/lib/league-config';
import { TeamCrest } from '@/components/ui/TeamCrest';
import type { LiveMatch } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

function statusInfo(status: LiveMatch['status'], minute?: string) {
  if (status === 'IN_PLAY' || status === 'LIVE')
    return { label: minute ? `${minute}'` : 'LIVE', isLive: true };
  if (status === 'PAUSED' || status === 'HT') return { label: 'HT', isLive: true };
  if (status === 'FINISHED' || status === 'FT') return { label: 'FT', isLive: false };
  return { label: 'NS', isLive: false };
}

function MatchRow({ match }: { match: LiveMatch }) {
  const status = statusInfo(match.status, match.minute);
  const showScores = match.homeScore !== null && match.awayScore !== null;

  return (
    <Link
      href={{ pathname: '/tran-dau/[id]', params: { id: String(match.id) } }}
      className="flex items-center gap-2.5 py-2.5 border-b border-white/10 last:border-0 hover:bg-white/5 -mx-1 px-1 rounded-lg transition-colors group"
    >
      <span className={`text-[10px] font-bold uppercase w-8 shrink-0 ${status.isLive ? 'text-brand-gold animate-pulse' : 'text-white/40'}`}>
        {status.label}
      </span>
      <TeamCrest teamName={match.homeTeam} crest={match.homeCrest} size="sm" />
      <div className="flex flex-1 items-center justify-center gap-1.5 min-w-0">
        <span className="font-mono text-xs font-bold text-brand-gold tabular-nums shrink-0 bg-white/10 rounded px-1.5 py-0.5">
          {showScores ? `${match.homeScore}-${match.awayScore}` : 'vs'}
        </span>
      </div>
      <TeamCrest teamName={match.awayTeam} crest={match.awayCrest} size="sm" />
      <div className="hidden min-w-0 flex-1 flex-col sm:flex">
        <span className="truncate text-[11px] text-white/80 font-medium">{match.homeTeam}</span>
        <span className="truncate text-[11px] text-white/50 font-medium">{match.awayTeam}</span>
      </div>
    </Link>
  );
}

export function LiveScoresWidget() {
  const dispatch = useAppDispatch();
  const t = useTranslations('sidebar');
  const tStates = useTranslations('states');
  const { matches, status, error } = useAppSelector((s) => s.matches);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchMatches({ leagueId: String(DEFAULT_LEAGUE.id), tab: 'live' }));
    }
  }, [dispatch, status]);

  return (
    <div className="bdh-card-dark p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-brand-gold">
          {t('liveScores')}
        </h3>
        <span className="flex items-center gap-1 text-[10px] font-bold text-brand-red">
          <Circle className="h-2 w-2 fill-brand-red text-brand-red animate-pulse" />
          V.League
        </span>
      </div>

      {status === 'loading' && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full bg-white/10" />
          ))}
        </div>
      )}

      {status === 'failed' && (
        <ErrorState
          title={tStates('errorTitle')}
          message={error ?? tStates('errorMessage')}
          retryLabel={tStates('retry')}
          onRetry={() => void dispatch(fetchMatches({ leagueId: String(DEFAULT_LEAGUE.id), tab: 'live' }))}
        />
      )}

      {status === 'succeeded' && (
        <>
          {matches.length > 0 ? (
            <div>{matches.slice(0, 5).map((m) => <MatchRow key={m.id} match={m} />)}</div>
          ) : (
            <p className="py-3 text-center text-sm text-white/50">{t('noLiveMatches')}</p>
          )}
        </>
      )}

      <Link
        href="/tran-dau"
        className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-gold hover:underline"
      >
        {t('seeAllMatches')}
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

export default LiveScoresWidget;
