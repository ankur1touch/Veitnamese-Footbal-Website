'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PlayerAvatar } from '@/components/ui/PlayerAvatar';
import type { PlayerInfo, PlayerStatistics } from '@/types';

interface PlayerProfileCardProps {
  player: PlayerInfo;
  statistics: PlayerStatistics[];
}

export function PlayerProfileCard({ player, statistics }: PlayerProfileCardProps) {
  const t = useTranslations('players');
  const stat = statistics[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-card">
      <div className="bg-gradient-to-r from-brand-navy to-brand-navy/90 px-6 py-5">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <PlayerAvatar
            name={player.name}
            photo={player.photo}
            teamLogo={stat?.team?.logo}
            size="lg"
          />
          <div className="flex-1 text-white">
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{player.name}</h1>
            {stat?.team ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Link
                  href={{ pathname: '/doi-bong/[id]', params: { id: String(stat.team.id) } }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 hover:bg-white/20 transition-colors"
                >
                  {stat.team.logo ? (
                    <Image src={stat.team.logo} alt="" width={18} height={18} className="object-contain" />
                  ) : null}
                  <span className="text-sm font-semibold text-brand-gold">{stat.team.name}</span>
                </Link>
                {stat.league?.name ? (
                  <span className="text-xs text-white/60">· {stat.league.name}</span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          {player.nationality ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="text-slate-400">{t('nationality')}:</span>
              <span className="font-semibold text-brand-navy">{player.nationality}</span>
            </span>
          ) : null}
          {player.age ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="text-slate-400">{t('age')}:</span>
              <span className="font-semibold text-brand-navy">{player.age}</span>
            </span>
          ) : null}
          {player.height ? <span>{player.height}</span> : null}
          {player.weight ? <span>{player.weight}</span> : null}
          {stat?.games?.position ? (
            <span className="rounded-full bg-brand-red/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-red">
              {stat.games.position}
            </span>
          ) : null}
        </div>

        {player.injured ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
            {t('injured')}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PlayerProfileCard;
