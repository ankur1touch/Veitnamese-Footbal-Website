import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Logo } from './Logo';

export function Footer() {
  const t = useTranslations('footer');
  const tSite = useTranslations('site');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 bg-brand-navy text-white">
      <div className="h-1 bg-gradient-to-r from-brand-red via-brand-gold to-brand-red" />
      <div className="container-fh py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <Logo size="md" variant="light" />
            <p className="mt-3 text-sm text-white/60 max-w-xs">{tSite('tagline')}</p>
          </div>

          <nav>
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3">Links</h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li><Link href="/tin-tuc" className="hover:text-brand-gold transition-colors">{t('about')}</Link></li>
              <li><Link href="/v-league" className="hover:text-brand-gold transition-colors">V.League</Link></li>
              <li><Link href="/ngoai-hang-anh" className="hover:text-brand-gold transition-colors">Premier League</Link></li>
              <li><Link href="/tran-dau" className="hover:text-brand-gold transition-colors">Trận đấu</Link></li>
            </ul>
          </nav>

          <nav>
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li><Link href="/gioi-thieu" className="hover:text-brand-gold transition-colors">{t('about')}</Link></li>
              <li><Link href="/lien-he" className="hover:text-brand-gold transition-colors">{t('contact')}</Link></li>
              <li><Link href="/chinh-sach" className="hover:text-brand-gold transition-colors">{t('privacy')}</Link></li>
              <li><a href="/rss.xml" className="hover:text-brand-gold transition-colors">{t('rss')}</a></li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/40">
          © {year} BóngĐáHôm · {t('rights')}
        </div>
      </div>
    </footer>
  );
}
