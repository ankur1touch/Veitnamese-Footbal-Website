'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { TeamCrest } from '@/components/ui/TeamCrest';
import type { LiveMatch } from '@/types';
import { showLiveMatchScores } from '@/lib/match-status';
import { cn } from '@/lib/utils';

function statusBadge(status: LiveMatch['status'], minute?: string) {
  if (status === 'IN_PLAY' || status === 'LIVE')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm shadow-brand-red/30 animate-pulse-live">
        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        {minute ? `${minute}'` : 'Live'}
      </span>
    );
  if (status === 'FINISHED' || status === 'FT')
    return (
      <span className="rounded-full bg-brand-navy px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
        FT
      </span>
    );
  if (status === 'HT' || status === 'PAUSED')
    return (
      <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
        HT
      </span>
    );
  return (
    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
      {minute ?? 'NS'}
    </span>
  );
}

interface MatchCardRowProps {
  match: LiveMatch;
}

export function MatchCardRow({ match }: MatchCardRowProps) {
  const locale = useLocale();
  const showScores = showLiveMatchScores(match);
  const isLive = match.status === 'IN_PLAY' || match.status === 'LIVE' || match.status === 'HT';
  const [kickoff, setKickoff] = useState('');

  useEffect(() => {
    const dateLoc = locale === 'vi' ? 'vi-VN' : 'en-GB';
    setKickoff(
      new Date(match.utcDate).toLocaleTimeString(dateLoc, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    );
  }, [match.utcDate, locale]);

  return (
    <Link
      href={{ pathname: '/tran-dau/[id]', params: { id: String(match.id) } }}
      className={cn(
        'group block border-b border-brand-border/60 last:border-0 transition-all duration-200',
        isLive
          ? 'bg-gradient-to-r from-brand-red/[0.06] via-transparent to-transparent hover:from-brand-red/10'
          : 'hover:bg-gradient-to-r hover:from-brand-gold/[0.06] hover:to-transparent',
      )}
    >
      <div className="flex items-center gap-3 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5">
        <div className="hidden w-16 shrink-0 sm:block">{statusBadge(match.status, match.minute)}</div>

        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          {/* Home team */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
            <span className="truncate text-right text-sm font-bold text-brand-navy transition-colors group-hover:text-brand-red sm:text-base">
              {match.homeTeam}
            </span>
            <TeamCrest teamName={match.homeTeam} crest={match.homeCrest} size="md" />
          </div>

          {/* Score / time */}
          <div className="flex w-[76px] shrink-0 flex-col items-center sm:w-28">
            <div className="sm:hidden mb-1.5">{statusBadge(match.status, match.minute)}</div>
            {showScores ? (
              <div className="flex items-center gap-1.5 rounded-xl bg-brand-navy px-3 py-1.5 shadow-sm">
                <span className="font-display text-xl font-extrabold tabular-nums text-white sm:text-2xl">
                  {match.homeScore ?? 0}
                </span>
                <span className="text-brand-gold/60 font-bold">–</span>
                <span className="font-display text-xl font-extrabold tabular-nums text-white sm:text-2xl">
                  {match.awayScore ?? 0}
                </span>
              </div>
            ) : (
              <span className="rounded-xl bg-brand-surface px-3 py-1.5 font-display text-base font-extrabold text-slate-400 sm:text-lg">
                vs
              </span>
            )}
            <span className="mt-1 text-[10px] font-semibold tabular-nums text-slate-400" suppressHydrationWarning>
              {kickoff || '–'}
            </span>
          </div>

          {/* Away team */}
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <TeamCrest teamName={match.awayTeam} crest={match.awayCrest} size="md" />
            <span className="truncate text-left text-sm font-bold text-brand-navy transition-colors group-hover:text-brand-red sm:text-base">
              {match.awayTeam}
            </span>
          </div>
        </div>

        <span className="hidden shrink-0 rounded-full bg-brand-red/10 px-2 py-1 text-brand-red opacity-0 transition-all group-hover:opacity-100 sm:inline">
          →
        </span>
      </div>
    </Link>
  );
}

export default MatchCardRow;
