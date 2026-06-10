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
    title: 'La Liga — Bóng đá Tây Ban Nha',
    description: 'Tin tức, bảng xếp hạng và phân tích La Liga.',
  };
}

export default async function LaLigaPage({
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
      endpoint={BanthangVnEndpoints.LaLiga}
      title="La Liga"
      description="Tin tức, bảng xếp hạng và phân tích La Liga Tây Ban Nha."
      page={page ? Number(page) : 1}
      accentClass="from-orange-700 to-orange-500"
      locale={locale}
    />
  );
}
