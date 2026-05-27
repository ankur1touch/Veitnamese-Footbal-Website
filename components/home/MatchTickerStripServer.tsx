import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getTickerMatches } from '@/lib/football-api';
import { TeamCrest } from '@/components/ui/TeamCrest';
import { showLiveMatchScores } from '@/lib/match-status';
import type { LiveMatch } from '@/types';
import { cn } from '@/lib/utils';

function TickerPill({ match }: { match: LiveMatch }) {
  const isLive = match.status === 'IN_PLAY' || match.status === 'LIVE' || match.status === 'HT';
  const showScores = showLiveMatchScores(match);

  return (
    <Link
      href={{ pathname: '/tran-dau/[id]', params: { id: String(match.id) } }}
      className={cn(
        'inline-flex shrink-0 snap-start items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-brand-red/40',
        isLive ? 'border-brand-red/30 bg-brand-red/5' : 'border-brand-border bg-white',
      )}
    >
      {isLive && <span className="h-1.5 w-1.5 rounded-full bg-brand-red animate-pulse-live" />}
      <TeamCrest teamName={match.homeTeam} crest={match.homeCrest} size="sm" />
      <span className="font-mono tabular-nums text-brand-navy">
        {showScores && match.homeScore !== null && match.awayScore !== null
          ? `${match.homeScore}-${match.awayScore}`
          : 'vs'}
      </span>
      <TeamCrest teamName={match.awayTeam} crest={match.awayCrest} size="sm" />
      <span className="hidden max-w-[72px] truncate text-slate-500 sm:inline">{match.competition}</span>
    </Link>
  );
}

export async function MatchTickerStripServer() {
  const t = await getTranslations('home.ticker');
  const matches = await getTickerMatches();

  if (matches.length === 0) return null;

  const items = [...matches, ...matches];

  return (
    <section className="border-y border-brand-border bg-white">
      <div className="container-fh flex items-center gap-3 py-2">
        <span className="shrink-0 rounded-full bg-brand-red px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          {t('live')}
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max gap-3 animate-marquee hover:[animation-play-state:paused]">
            {items.map((m, i) => (
              <TickerPill key={`${m.id}-${i}`} match={m} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MatchTickerStripServer;
