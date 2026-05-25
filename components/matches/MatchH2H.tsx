'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { FixtureDetail } from '@/types';

interface MatchH2HProps {
  h2h: FixtureDetail[];
}

export function MatchH2H({ h2h }: MatchH2HProps) {
  const t = useTranslations('detail');

  if (!h2h.length) {
    return <p className="py-8 text-center text-sm text-slate-400">{t('noH2H')}</p>;
  }

  return (
    <div className="space-y-2">
      <p className="mb-3 text-xs text-slate-400">{t('lastMeetings', { count: h2h.length })}</p>
      {h2h.map((m) => (
        <Link
          key={m.fixture.id}
          href={{ pathname: '/tran-dau/[id]', params: { id: String(m.fixture.id) } }}
          className="flex items-center gap-2 rounded-lg border border-brand-border bg-white px-4 py-3 hover:bg-brand-surface"
        >
          <span className="w-20 text-xs text-slate-400">{m.fixture.date.slice(0, 10)}</span>
          {m.teams.home.logo ? (
            <Image src={m.teams.home.logo} alt="" width={16} height={16} className="object-contain" />
          ) : null}
          <span className="flex-1 truncate text-right text-sm font-medium">{m.teams.home.name}</span>
          <span className="font-display text-sm font-extrabold tabular-nums">
            {m.goals.home ?? '–'} – {m.goals.away ?? '–'}
          </span>
          <span className="flex-1 truncate text-sm font-medium">{m.teams.away.name}</span>
          {m.teams.away.logo ? (
            <Image src={m.teams.away.logo} alt="" width={16} height={16} className="object-contain" />
          ) : null}
        </Link>
      ))}
    </div>
  );
}

export default MatchH2H;
