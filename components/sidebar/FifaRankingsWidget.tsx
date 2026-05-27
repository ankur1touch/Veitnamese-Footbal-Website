import { getTranslations } from 'next-intl/server';
import { getFifaRankings } from '@/lib/football-api';
import { TeamCrest } from '@/components/ui/TeamCrest';

export async function FifaRankingsWidget() {
  const t = await getTranslations('home.fifaRankings');
  const all = await getFifaRankings(11);
  const rankings = all.slice(0, 10);
  const vietnam = all.find((r) => r.team.toLowerCase().includes('vietnam'));

  return (
    <div className="bdh-card-dark p-4">
      <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-brand-gold">
        {t('title')}
      </h3>
      <ol className="mt-3 space-y-2">
        {rankings.map((row) => (
          <li
            key={row.rank}
            className="flex items-center gap-2.5 border-b border-white/10 py-2 last:border-0"
          >
            <span className="w-5 text-center font-mono text-xs font-bold text-white/40">{row.rank}</span>
            <TeamCrest teamName={row.team} crest={row.crest} size="sm" />
            <span className="min-w-0 flex-1 truncate text-xs font-semibold text-white">{row.team}</span>
            <span className="font-mono text-[11px] tabular-nums text-brand-gold">{row.points}</span>
          </li>
        ))}
      </ol>
      {vietnam && !rankings.some((r) => r.team === vietnam.team) && (
        <div className="mt-3 rounded-lg border border-brand-gold/30 bg-brand-gold/10 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">{t('vietnam')}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-white">#{vietnam.rank}</span>
            <TeamCrest teamName={vietnam.team} crest={vietnam.crest} size="sm" />
            <span className="text-xs font-semibold text-white">{vietnam.team}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default FifaRankingsWidget;
