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
    title: 'Đội tuyển — Tin tức bóng đá quốc gia',
    description: 'Tin tức đội tuyển quốc gia Việt Nam và các đội tuyển thế giới.',
  };
}

export default async function NationalTeamsPage({
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
      endpoint={BanthangVnEndpoints.NationalTeams}
      title="Đội tuyển"
      description="Tin tức đội tuyển quốc gia Việt Nam và các đội tuyển thế giới."
      page={page ? Number(page) : 1}
      accentClass="from-red-800 to-red-600"
      locale={locale}
    />
  );
}
