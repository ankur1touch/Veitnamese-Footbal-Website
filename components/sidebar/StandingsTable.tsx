'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRankings } from '@/store/features/rankingsSlice';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

interface StandingsTableProps {
  limit?: number;
  showLink?: boolean;
  autoFetch?: boolean;
}

export function StandingsTable({ limit = 5, showLink = true, autoFetch = true }: StandingsTableProps) {
  const dispatch = useAppDispatch();
  const t = useTranslations('sidebar');
  const tTable = useTranslations('table');
  const { standings, status, error } = useAppSelector((s) => s.rankings);

  useEffect(() => {
    if (autoFetch && status === 'idle') {
      void dispatch(fetchRankings());
    }
  }, [autoFetch, dispatch, status]);

  const slice = standings.slice(0, limit);

  return (
    <div className="bdh-card-dark p-4">
      <h3 className="mb-3 font-display text-sm font-extrabold uppercase tracking-wider text-brand-gold">
        {t('standings')}
      </h3>

      {status === 'loading' && (
        <div className="space-y-2">
          {Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-full bg-white/10" />
          ))}
        </div>
      )}

      {status === 'failed' && (
        <ErrorState
          title="Error"
          message={error ?? 'Failed to load standings.'}
          onRetry={() => void dispatch(fetchRankings())}
        />
      )}

      {status === 'succeeded' && (
        <div className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">
                <th className="py-1.5 pl-1 w-6">#</th>
                <th className="py-1.5">{tTable('team')}</th>
                <th className="py-1.5 text-center w-8">{tTable('played')}</th>
                <th className="py-1.5 text-center w-10 font-extrabold text-brand-gold">{tTable('points')}</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((row) => (
                <tr key={row.position} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2 pl-1 font-mono font-bold text-white/50 text-xs">{row.position}</td>
                  <td className="py-2 font-semibold text-white truncate max-w-[110px] text-sm">
                    {row.teamId ? (
                      <Link href={{ pathname: '/doi-bong/[id]', params: { id: String(row.teamId) } }} className="hover:text-brand-gold transition-colors">
                        {row.teamShort}
                      </Link>
                    ) : (
                      row.teamShort
                    )}
                  </td>
                  <td className="py-2 text-center text-white/50 tabular-nums text-xs">{row.played}</td>
                  <td className="py-2 text-center font-mono font-bold text-brand-gold tabular-nums">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showLink && (
        <Link
          href="/bang-xep-hang"
          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-gold hover:underline"
        >
          {t('standings')}
          <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

export default StandingsTable;
