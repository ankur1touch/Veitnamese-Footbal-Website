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
    title: 'Phân tích — Góc nhìn chiến thuật bóng đá',
    description: 'Bài viết phân tích chiến thuật, chiến lược và góc nhìn chuyên sâu về bóng đá.',
  };
}

export default async function AnalysisPage({
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
      endpoint={BanthangVnEndpoints.Analysis}
      title="Phân tích"
      description="Bài viết phân tích chiến thuật, chiến lược và góc nhìn chuyên sâu về bóng đá."
      page={page ? Number(page) : 1}
      accentClass="from-cyan-900 to-cyan-700"
      locale={locale}
    />
  );
}
