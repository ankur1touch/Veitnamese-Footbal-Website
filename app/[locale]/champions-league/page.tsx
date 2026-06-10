import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CmsSectionPage } from '@/components/cms/CmsSectionPage';
import { BanthangVnEndpoints } from '@/lib/banthangVnApi';

export const revalidate = 60;

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<{ page?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  void locale;
  return {
    title: 'Champions League — Tin tức cúp C1',
    description: 'Tin tức, kết quả và phân tích UEFA Champions League.',
  };
}

export default async function ChampionsLeaguePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  const { page } = await searchParams;
  setRequestLocale(locale);

  return (
    <CmsSectionPage
      endpoint={BanthangVnEndpoints.ChampionsLeague}
      title="Champions League"
      description="Tin tức, kết quả và phân tích UEFA Champions League."
      page={page ? Number(page) : 1}
      accentClass="from-indigo-900 to-indigo-700"
      locale={locale}
    />
  );
}
