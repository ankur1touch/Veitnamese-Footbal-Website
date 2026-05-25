'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRankings } from '@/store/features/rankingsSlice';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

function initials(name: string): string {
  const parts = name.split(/[\s.]+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface TopScorersWidgetProps {
  autoFetch?: boolean;
}

export function TopScorersWidget({ autoFetch = true }: TopScorersWidgetProps) {
  const dispatch = useAppDispatch();
  const t = useTranslations('sidebar');
  const { topScorers, status, error } = useAppSelector((s) => s.rankings);

  useEffect(() => {
    if (autoFetch && status === 'idle') {
      void dispatch(fetchRankings());
    }
  }, [autoFetch, dispatch, status]);

  const top = topScorers.slice(0, 5);

  return (
    <div className="bdh-card-dark p-4">
      <h3 className="mb-3 font-display text-sm font-extrabold uppercase tracking-wider text-brand-gold">
        {t('topScorers')}
      </h3>

      {status === 'loading' && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full bg-white/10" />
          ))}
        </div>
      )}

      {status === 'failed' && (
        <ErrorState
          title="Error"
          message={error ?? 'Failed to load scorers.'}
          onRetry={() => void dispatch(fetchRankings())}
        />
      )}

      {status === 'succeeded' && (
        <ol className="space-y-2">
          {top.map((s, idx) => (
            <li key={`${s.name}-${idx}`} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
              <span className="font-mono text-lg font-black text-brand-gold/60 w-5 shrink-0">
                {idx + 1}
              </span>
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red text-[10px] font-extrabold text-white"
              >
                {initials(s.name)}
              </div>
              <div className="min-w-0 flex-1">
                {s.playerId ? (
                  <Link href={{ pathname: '/cau-thu/[id]', params: { id: String(s.playerId) } }} className="truncate text-sm font-bold text-white hover:text-brand-gold block transition-colors">
                    {s.name}
                  </Link>
                ) : (
                  <p className="truncate text-sm font-bold text-white">{s.name}</p>
                )}
                <p className="truncate text-[11px] text-white/50">
                  {s.team} · <span className="text-brand-gold font-bold">{s.goals}</span> goals
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default TopScorersWidget;
