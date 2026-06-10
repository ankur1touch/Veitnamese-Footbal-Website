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
    title: 'Khác — Tin tức bóng đá tổng hợp',
    description: 'Tin tức bóng đá tổng hợp và các câu chuyện thú vị.',
  };
}

export default async function OtherPage({
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
      endpoint={BanthangVnEndpoints.Other}
      title="Khác"
      description="Tin tức bóng đá tổng hợp và các câu chuyện thú vị."
      page={page ? Number(page) : 1}
      accentClass="from-slate-700 to-slate-600"
      locale={locale}
    />
  );
}
