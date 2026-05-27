import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { MessageCircle, Trophy, Vote } from 'lucide-react';

export async function FanZoneStrip() {
  const t = await getTranslations('home.fanZone');

  const cards = [
    { icon: Vote, label: t('predict'), href: '/world-cup' as const, color: 'bg-brand-red' },
    { icon: MessageCircle, label: t('discuss'), href: '/tin-tuc' as const, color: 'bg-brand-navy' },
    { icon: Trophy, label: t('followWc'), href: '/world-cup' as const, color: 'bg-brand-gold text-brand-navy' },
  ];

  return (
    <section className="overflow-hidden rounded-2xl hero-gradient text-white">
      <div className="p-6 sm:p-8">
        <h2 className="font-display text-2xl uppercase tracking-wide sm:text-3xl">{t('title')}</h2>
        <p className="mt-2 max-w-xl text-sm text-white/75">{t('subtitle')}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {cards.map(({ icon: Icon, label, href, color }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide transition-transform hover:scale-[1.02] ${color}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FanZoneStrip;
