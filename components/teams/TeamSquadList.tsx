'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { PlayerAvatar } from '@/components/ui/PlayerAvatar';
import type { SquadPlayer } from '@/types';

const POSITION_ORDER = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];

interface TeamSquadListProps {
  squad: SquadPlayer[];
}

export function TeamSquadList({ squad }: TeamSquadListProps) {
  const t = useTranslations('detail');

  if (!squad.length) {
    return <p className="py-8 text-center text-sm text-slate-400">{t('squadEmpty')}</p>;
  }

  const grouped = POSITION_ORDER.reduce<Record<string, SquadPlayer[]>>((acc, pos) => {
    acc[pos] = squad.filter((p) => p.position === pos);
    return acc;
  }, {});

  const positionLabels: Record<string, string> = {
    Goalkeeper: t('posGK'),
    Defender: t('posDEF'),
    Midfielder: t('posMID'),
    Attacker: t('posFWD'),
  };

  const other = squad.filter((p) => !p.position || !POSITION_ORDER.includes(p.position));

  return (
    <div className="space-y-5">
      {POSITION_ORDER.map((pos) => {
        const players = grouped[pos];
        if (!players?.length) return null;
        return (
          <div key={pos}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {positionLabels[pos]}
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {players.map((p) => (
                <Link
                  key={p.id}
                  href={{ pathname: '/cau-thu/[id]', params: { id: String(p.id) } }}
                  className="flex items-center gap-3 rounded-lg border border-brand-border bg-white px-4 py-2.5 hover:bg-brand-surface"
                >
                  <div className="relative h-8 w-8 shrink-0">
                    <PlayerAvatar name={p.name} photo={p.photo} size="sm" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-brand-navy">{p.name}</span>
                  {p.number != null ? (
                    <span className="font-mono text-xs text-slate-400">#{p.number}</span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
      {other.length > 0 ? (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t('posOther')}
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {other.map((p) => (
              <Link
                key={p.id}
                href={{ pathname: '/cau-thu/[id]', params: { id: String(p.id) } }}
                className="flex items-center gap-3 rounded-lg border border-brand-border px-4 py-2.5 hover:bg-brand-surface"
              >
                <span className="text-sm font-medium">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TeamSquadList;
