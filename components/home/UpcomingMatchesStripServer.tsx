import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { getLiveMatches } from '@/lib/football-api';
import { LEAGUES } from '@/lib/league-config';
import { formatMatchKickoff } from '@/lib/dates';
import { TeamCrest } from '@/components/ui/TeamCrest';

export async function UpcomingMatchesStripServer() {
  const t = await getTranslations('home.upcoming');
  const locale = await getLocale();
  const [epl, ucl] = await Promise.all([
    getLiveMatches(LEAGUES.epl.id, 'upcoming'),
    getLiveMatches(LEAGUES.ucl.id, 'upcoming'),
  ]);
  const matches = [...epl, ...ucl]
    .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)
    .slice(0, 8);

  if (matches.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="bdh-section-title">{t('title')}</h2>
        <Link
          href="/tran-dau"
          className="inline-flex items-center gap-1 text-sm font-bold text-brand-red hover:underline"
        >
          {t('seeAll')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="bdh-strip-scroll">
        {matches.map((match) => (
          <Link
            key={match.id}
            href={{ pathname: '/tran-dau/[id]', params: { id: String(match.id) } }}
            className="snap-start shrink-0 w-56 rounded-2xl border border-brand-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {match.competition}
            </p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <TeamCrest teamName={match.homeTeam} crest={match.homeCrest} size="md" />
                <span className="truncate text-xs font-semibold text-brand-navy">{match.homeTeam}</span>
              </div>
              <span className="font-display text-lg text-brand-red">VS</span>
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <TeamCrest teamName={match.awayTeam} crest={match.awayCrest} size="md" />
                <span className="truncate text-xs font-semibold text-brand-navy">{match.awayTeam}</span>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] font-medium text-slate-500">
              {formatMatchKickoff(match.utcDate, locale)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default UpcomingMatchesStripServer;
