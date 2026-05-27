import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getMatchOfTheDay } from '@/lib/football-api';
import { TeamCrest } from '@/components/ui/TeamCrest';
import { MatchCountdown } from './MatchCountdown';
import { showLiveMatchScores } from '@/lib/match-status';

export async function MatchOfTheDay() {
  const t = await getTranslations('home.matchOfDay');
  const match = await getMatchOfTheDay();

  if (!match) return null;

  const showScores = showLiveMatchScores(match);
  const isLive = match.status === 'IN_PLAY' || match.status === 'LIVE';

  return (
    <section className="bdh-card-dark overflow-hidden">
      <div className="border-b border-white/10 px-5 py-3">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-widest text-brand-gold">
          {t('title')}
        </h2>
      </div>
      <div className="grid gap-6 p-5 sm:grid-cols-2 sm:items-center sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">{match.competition}</p>
          <div className="mt-4 flex items-center justify-center gap-4 sm:justify-start sm:gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <TeamCrest teamName={match.homeTeam} crest={match.homeCrest} size="lg" />
              <span className="text-sm font-bold text-white">{match.homeTeam}</span>
            </div>
            <div className="text-center">
              {showScores && match.homeScore !== null && match.awayScore !== null ? (
                <span className="font-display text-4xl tabular-nums text-brand-gold">
                  {match.homeScore} - {match.awayScore}
                </span>
              ) : (
                <span className="font-display text-2xl text-white/60">VS</span>
              )}
              {isLive && (
                <p className="mt-1 text-[10px] font-bold uppercase text-brand-red animate-pulse-live">
                  {t('live')}
                </p>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <TeamCrest teamName={match.awayTeam} crest={match.awayCrest} size="lg" />
              <span className="text-sm font-bold text-white">{match.awayTeam}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 sm:items-end">
          {!isLive && match.status === 'SCHEDULED' && (
            <div className="text-center sm:text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">{t('countdown')}</p>
              <MatchCountdown kickoff={match.utcDate} className="mt-2 justify-center sm:justify-end" />
            </div>
          )}
          <Link
            href={{ pathname: '/tran-dau/[id]', params: { id: String(match.id) } }}
            className="bdh-pill-btn bg-brand-gold text-brand-navy hover:bg-brand-gold-dark"
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default MatchOfTheDay;
