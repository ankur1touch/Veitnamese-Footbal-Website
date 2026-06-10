import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Badge } from '@/components/ui/Badge';
import { CmsSectionPage } from '@/components/cms/CmsSectionPage';
import { BanthangVnEndpoints } from '@/lib/banthangVnApi';

export const revalidate = 60;

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<{ page?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return {
    title: t('worldCup'),
    description:
      locale === 'vi'
        ? 'Tin tức World Cup 2026 — lịch thi đấu, kết quả và phân tích'
        : 'World Cup 2026 news — fixtures, results and analysis',
  };
}

export default async function WorldCupPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  const { page } = await searchParams;
  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <div>
      <header className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 py-10">
        <div className="container-fh">
          <Badge variant="navy" className="mb-3">
            FIFA
          </Badge>
          <h1 className="font-display text-4xl font-extrabold text-brand-navy md:text-5xl">
            {tNav('worldCup')}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-brand-navy/80">
            {locale === 'vi'
              ? 'Tin tức, lịch thi đấu và phân tích World Cup 2026'
              : 'World Cup 2026 news, fixtures and analysis'}
          </p>
        </div>
      </header>

      {/* CMS articles */}
      <CmsSectionPage
        endpoint={BanthangVnEndpoints.WorldCup}
        title=""
        page={page ? Number(page) : 1}
        accentClass="from-emerald-900 to-emerald-700"
        locale={locale}
      />
    </div>
  );
}
