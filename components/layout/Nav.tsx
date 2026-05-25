'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export const NAV_LINKS = [
  { key: 'news', href: '/tin-tuc' },
  { key: 'matches', href: '/tran-dau' },
  { key: 'standings', href: '/bang-xep-hang' },
  { key: 'players', href: '/cau-thu' },
  { key: 'vleague', href: '/v-league' },
  { key: 'worldCup', href: '/world-cup' },
] as const;

export type NavLinkKey = (typeof NAV_LINKS)[number]['key'];

function isNavActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href !== '/' && pathname.startsWith(`${href}/`)) return true;
  return false;
}

export function Nav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav className="hidden lg:block py-2">
      <ul className="flex items-center gap-1.5 overflow-x-auto">
        {NAV_LINKS.map((link) => {
          const isActive = isNavActive(pathname, link.href);
          return (
            <li key={link.key} className="shrink-0">
              <Link
                href={link.href}
                className={cn(
                  'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold transition-all',
                  isActive
                    ? 'bg-brand-red text-white shadow-md'
                    : 'text-white/75 hover:bg-white/10 hover:text-white',
                )}
              >
                {t(link.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
