import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Logo, LogoMark } from './Logo';
import { FooterNewsletter } from './FooterNewsletter';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tSite = useTranslations('site');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 bg-brand-navy text-white">
      <div className="h-1 bg-gradient-to-r from-brand-red via-brand-gold to-brand-red" />
      <div className="container-fh py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            {/* Shield icon + HTML wordmark — font-body (Nunito Sans) supports Vietnamese */}
            <div className="flex items-center gap-2.5">
              <LogoMark size={38} />
              <div className="flex flex-col leading-none select-none">
                <span className="font-body text-[18px] font-black tracking-tight leading-none text-white">
                  Ban<span className="text-brand-gold">Thắng</span><span className="text-white/45">.VN</span>
                </span>
                <span className="mt-1 font-body text-[8px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  Tin bóng đá · Mỗi ngày
                </span>
              </div>
            </div>
            <p className="mt-3 max-w-xs text-sm text-white/60">{tSite('tagline')}</p>
          </div>

          <nav>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-gold">
              {t('football')}
            </h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li><Link href="/tran-dau" className="hover:text-brand-gold transition-colors">{tNav('matches')}</Link></li>
              <li><Link href="/bang-xep-hang" className="hover:text-brand-gold transition-colors">{tNav('standings')}</Link></li>
              <li><Link href="/cau-thu" className="hover:text-brand-gold transition-colors">{tNav('players')}</Link></li>
              <li><Link href="/v-league" className="hover:text-brand-gold transition-colors">{tNav('vleague')}</Link></li>
            </ul>
          </nav>

          <nav>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-gold">
              {t('tournaments')}
            </h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li><Link href="/ngoai-hang-anh" className="hover:text-brand-gold transition-colors">Premier League</Link></li>
              <li><Link href="/tran-dau" className="hover:text-brand-gold transition-colors">Champions League</Link></li>
              <li><Link href="/world-cup" className="hover:text-brand-gold transition-colors">{tNav('worldCup')}</Link></li>
              <li><Link href="/tin-tuc" className="hover:text-brand-gold transition-colors">{tNav('news')}</Link></li>
            </ul>
          </nav>

          <FooterNewsletter />
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} BanThangVN · {t('rights')}</span>
          <div className="flex gap-4">
            <Link href="/gioi-thieu" className="hover:text-brand-gold transition-colors">{t('about')}</Link>
            <Link href="/lien-he" className="hover:text-brand-gold transition-colors">{t('contact')}</Link>
            <Link href="/chinh-sach" className="hover:text-brand-gold transition-colors">{t('privacy')}</Link>
            <a href="/rss.xml" className="hover:text-brand-gold transition-colors">{t('rss')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
