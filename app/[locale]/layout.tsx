import type { Metadata } from 'next';
import { Nunito_Sans, Bebas_Neue, Outfit, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale, getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { BreakingTicker } from '@/components/layout/BreakingTicker';
import { Footer } from '@/components/layout/Footer';
import { fetchBanthangVnHomePage, banthangVnToNewsItem } from '@/lib/banthangVnApi';
import { StoreProvider } from '@/store/StoreProvider';
import '../globals.css';

const nunito = Nunito_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '600', '700', '800', '900'],
});

const bebas = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-ui',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '700'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://banthangvn.com'),
    title: {
      default: `${t('name')} — ${t('tagline')}`,
      template: `%s · ${t('name')}`,
    },
    description: t('description'),
    openGraph: {
      type: 'website',
      siteName: t('name'),
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      alternateLocale: locale === 'vi' ? ['en_US'] : ['vi_VN'],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  let breakingNews: import('@/types').NewsItem[] = [];
  try {
    const cmsRes = await fetchBanthangVnHomePage(8);
    breakingNews = (cmsRes?.data ?? []).map(banthangVnToNewsItem);
  } catch (err) {
    console.error('[layout] breaking news failed:', (err as Error).message);
  }

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'BanThangVN',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://banthangvn.com',
    inLanguage: locale === 'vi' ? 'vi-VN' : 'en-US',
    sameAs: [],
  };

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${nunito.variable} ${bebas.variable} ${outfit.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-brand-surface text-brand-navy font-sans">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            <Header />
            <BreakingTicker items={breakingNews} />
            <main className="flex-1">{children}</main>
            <Footer />
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
