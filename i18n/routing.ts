import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/tin-tuc': { vi: '/tin-tuc', en: '/news' },
    '/tin-tuc/[slug]': { vi: '/tin-tuc/[slug]', en: '/news/[slug]' },
    '/tran-dau': { vi: '/tran-dau', en: '/matches' },
    '/tran-dau/[id]': { vi: '/tran-dau/[id]', en: '/matches/[id]' },
    '/bang-xep-hang': { vi: '/bang-xep-hang', en: '/standings' },
    '/cau-thu': { vi: '/cau-thu', en: '/players' },
    '/cau-thu/[id]': { vi: '/cau-thu/[id]', en: '/players/[id]' },
    '/doi-bong/[id]': { vi: '/doi-bong/[id]', en: '/teams/[id]' },
    '/world-cup': { vi: '/world-cup', en: '/world-cup' },
    '/v-league': { vi: '/v-league', en: '/v-league' },
    '/ngoai-hang-anh': { vi: '/ngoai-hang-anh', en: '/premier-league' },
    '/tim-kiem': { vi: '/tim-kiem', en: '/search' },
    '/lien-he': { vi: '/lien-he', en: '/contact' },
    '/chinh-sach': { vi: '/chinh-sach', en: '/privacy' },
    '/gioi-thieu': { vi: '/gioi-thieu', en: '/about' },
    '/quang-cao': { vi: '/quang-cao', en: '/advertise' },
    // CMS section routes (banthangvn.com)
    '/premier-league': '/premier-league',
    '/champions-league': '/champions-league',
    '/la-liga': '/la-liga',
    '/national-teams': '/national-teams',
    '/transfers': '/transfers',
    '/analysis': '/analysis',
    '/other': '/other',
    '/bai-viet/[slug]': '/bai-viet/[slug]',
  },
});

export type Locale = (typeof routing.locales)[number];
