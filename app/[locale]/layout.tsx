import type { Metadata } from 'next';
import { Nunito_Sans, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale, getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { BreakingTicker } from '@/components/layout/BreakingTicker';
import { NewsletterCTA } from '@/components/layout/NewsletterCTA';
import { Footer } from '@/components/layout/Footer';
import { getBreakingNews } from '@/lib/rss';
import { StoreProvider } from '@/store/StoreProvider';
import '../globals.css';

const nunito = Nunito_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-display',
  display: 'swap',
  weight: ['700', '800', '900'],
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
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
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
  let breakingNews: Awaited<ReturnType<typeof getBreakingNews>> = [];
  try {
    breakingNews = await getBreakingNews();
  } catch (err) {
    console.error('[layout] breaking news failed:', (err as Error).message);
  }

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'BóngĐáHôm',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bongdahom.net',
    inLanguage: locale === 'vi' ? 'vi-VN' : 'en-US',
    sameAs: [],
  };

  return (
    <html
      lang={locale}
      className={`${nunito.variable} ${playfair.variable} ${jetbrains.variable}`}
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
            <NewsletterCTA />
            <Footer />
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
