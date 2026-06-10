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
    title: 'Ngoại hạng Anh — Tin tức Premier League',
    description: 'Tin tức, kết quả và phân tích Ngoại hạng Anh.',
  };
}

export default async function PremierLeaguePage({
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
      endpoint={BanthangVnEndpoints.PremierLeague}
      title="Ngoại hạng Anh"
      description="Tin tức, kết quả và phân tích Ngoại hạng Anh (Premier League)."
      page={page ? Number(page) : 1}
      accentClass="from-blue-900 to-blue-700"
      locale={locale}
    />
  );
}
