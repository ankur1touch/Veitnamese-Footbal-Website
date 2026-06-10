import { Logo } from './Logo';
import { Nav } from './Nav';
import { MobileNav } from './MobileNav';
import { LocaleSwitcher } from './LocaleSwitcher';
import { HeaderSearch } from './HeaderSearch';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/Badge';

export async function Header() {
  return (
    <header className="sticky top-0 z-40">
      {/* Vietnamese flag accent stripe */}
      <div className="h-1 bg-gradient-to-r from-brand-red via-brand-gold to-brand-red" />

      <div className="bg-brand-navy text-white shadow-lg">
        <div className="container-fh">
          {/* Top row: logo + search + locale */}
          <div className="flex h-16 items-center gap-3 sm:gap-4 border-b border-white/10">
            <div className="flex min-w-0 items-center gap-2.5">
              <Logo size="md" />
              {/* Site wordmark — font-body = Nunito Sans (latin+vietnamese), always crisp */}
              <Link href="/" className="hidden sm:flex flex-col leading-none select-none" aria-label="BanThangVN">
                <span className="font-body text-[19px] font-black tracking-tight leading-none text-white">
                  Ban<span className="text-brand-gold">Thắng</span><span className="text-white/45">.VN</span>
                </span>
                <span className="mt-1 font-body text-[9px] font-semibold uppercase tracking-[0.16em] text-white/38">
                  Tin bóng đá · Mỗi ngày
                </span>
              </Link>
              <Link
                href="/world-cup"
                className="hidden shrink-0 lg:inline-flex"
              >
                <Badge variant="wc" className="px-3 py-1 text-[10px] tracking-widest hover:bg-brand-gold-dark transition-colors">
                  WC 2026
                </Badge>
              </Link>
            </div>
            <HeaderSearch />
            <div className="flex shrink-0 items-center gap-2">
              <Link href="/world-cup" className="sm:hidden">
                <Badge variant="wc" className="px-2 py-0.5 text-[9px]">WC</Badge>
              </Link>
              <LocaleSwitcher />
              <MobileNav />
            </div>
          </div>

          {/* Inline nav — pills, not a separate red bar */}
          <Nav />
        </div>
      </div>
    </header>
  );
}
