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
    title: 'Chuyển nhượng — Tin tức transfer bóng đá',
    description: 'Cập nhật tin chuyển nhượng bóng đá mới nhất.',
  };
}

export default async function TransfersPage({
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
      endpoint={BanthangVnEndpoints.Transfers}
      title="Chuyển nhượng"
      description="Cập nhật tin chuyển nhượng bóng đá mới nhất từ khắp nơi trên thế giới."
      page={page ? Number(page) : 1}
      accentClass="from-violet-900 to-violet-700"
      locale={locale}
    />
  );
}
