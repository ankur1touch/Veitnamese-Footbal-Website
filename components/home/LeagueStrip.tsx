import { Link } from '@/i18n/navigation';
import { Trophy, Globe, Star } from 'lucide-react';

const LEAGUES = [
  { href: '/v-league' as const, label: 'V.League 1', icon: Star, color: 'bg-brand-red text-white' },
  { href: '/ngoai-hang-anh' as const, label: 'Premier League', icon: Trophy, color: 'bg-blue-800 text-white' },
  { href: '/tran-dau' as const, label: 'Champions League', icon: Globe, color: 'bg-indigo-700 text-white' },
  { href: '/world-cup' as const, label: 'World Cup 2026', icon: Globe, color: 'bg-emerald-700 text-white' },
];

export function LeagueStrip() {
  return (
    <section className="mb-6">
      <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
        {LEAGUES.map(({ href, label, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className={`snap-start shrink-0 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-transform hover:scale-105 ${color}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
