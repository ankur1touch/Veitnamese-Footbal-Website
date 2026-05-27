import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Trophy, Globe, Star, Crown } from 'lucide-react';
import { LEAGUES } from '@/lib/league-config';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const TOURNAMENTS = [
  {
    key: 'vleague',
    href: '/v-league' as const,
    league: LEAGUES.vleague,
    icon: Star,
    accent: 'from-brand-red to-brand-red-dark',
    badge: 'red' as const,
  },
  {
    key: 'epl',
    href: '/ngoai-hang-anh' as const,
    league: LEAGUES.epl,
    icon: Trophy,
    accent: 'from-blue-900 to-brand-navy',
    badge: 'navy' as const,
  },
  {
    key: 'ucl',
    href: '/tran-dau' as const,
    league: LEAGUES.ucl,
    icon: Crown,
    accent: 'from-indigo-800 to-brand-navy',
    badge: 'tournament' as const,
  },
  {
    key: 'worldcup',
    href: '/world-cup' as const,
    league: LEAGUES.worldcup,
    icon: Globe,
    accent: 'from-brand-gold to-amber-600',
    badge: 'wc' as const,
  },
];

export async function TournamentsSection() {
  const t = await getTranslations('home.tournaments');

  return (
    <section>
      <div className="mb-4">
        <h2 className="bdh-section-title">{t('title')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('subtitle')}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TOURNAMENTS.map(({ key, href, league, icon: Icon, accent, badge }) => (
          <Link
            key={key}
            href={href}
            className="group relative overflow-hidden rounded-2xl border border-brand-border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={cn(
                'absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-90 transition-opacity group-hover:opacity-100',
                accent,
              )}
            />
            <div className="flex items-start justify-between gap-2">
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm',
                  accent,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <Badge variant={badge}>{league.country}</Badge>
            </div>
            <h3 className="mt-4 font-display text-xl uppercase tracking-wide text-brand-navy group-hover:text-brand-red transition-colors">
              {t(`${key}Name`)}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{t(`${key}Desc`)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default TournamentsSection;
