import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.90min.com' },
      { protocol: 'https', hostname: '**.goal.com' },
      { protocol: 'https', hostname: '**.bbc.co.uk' },
      { protocol: 'https', hostname: '**.skysports.com' },
      { protocol: 'https', hostname: '**.flashscore.com' },
      { protocol: 'https', hostname: '**.worldsoccer.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'crests.football-data.org' },
      { protocol: 'https', hostname: 'media.api-sports.io' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'images.fotmob.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return [
      { source: '/news', destination: '/tin-tuc', permanent: true },
      { source: '/matches', destination: '/tran-dau', permanent: true },
      { source: '/standings', destination: '/bang-xep-hang', permanent: true },
      { source: '/players', destination: '/cau-thu', permanent: true },
      { source: '/search', destination: '/tim-kiem', permanent: true },
      { source: '/contacto', destination: '/lien-he', permanent: true },
      { source: '/privacidad', destination: '/chinh-sach', permanent: true },
      { source: '/sobre-nosotros', destination: '/gioi-thieu', permanent: true },
      { source: '/publicidad', destination: '/quang-cao', permanent: true },
      // English locale: old /en/tin-tuc paths → /en/news
      { source: '/en/tin-tuc', destination: '/en/news', permanent: true },
      { source: '/en/tin-tuc/:slug', destination: '/en/news/:slug', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
