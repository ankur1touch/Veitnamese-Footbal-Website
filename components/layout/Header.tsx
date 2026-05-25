import { Logo } from './Logo';
import { Nav } from './Nav';
import { MobileNav } from './MobileNav';
import { LocaleSwitcher } from './LocaleSwitcher';
import { HeaderSearch } from './HeaderSearch';

export function Header() {
  return (
    <header className="sticky top-0 z-40">
      {/* Vietnamese flag accent stripe */}
      <div className="h-1 bg-gradient-to-r from-brand-red via-brand-gold to-brand-red" />

      <div className="bg-brand-navy text-white shadow-lg">
        <div className="container-fh">
          {/* Top row: logo + search + locale */}
          <div className="flex h-16 items-center gap-3 sm:gap-4 border-b border-white/10">
            <Logo size="md" variant="light" />
            <HeaderSearch />
            <div className="flex shrink-0 items-center gap-2">
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
