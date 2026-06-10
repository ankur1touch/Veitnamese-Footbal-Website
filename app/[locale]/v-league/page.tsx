import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LeagueHubClient } from '@/components/league/LeagueHubClient';
import { CmsSectionPage } from '@/components/cms/CmsSectionPage';
import { BanthangVnEndpoints } from '@/lib/banthangVnApi';
import { LEAGUES } from '@/lib/league-config';

export const revalidate = 60;

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<{ page?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'vi' ? 'V.League 1 — Bóng đá Việt Nam' : 'V.League 1 — Vietnamese Football',
    description: 'Tin tức, bảng xếp hạng, lịch thi đấu và vua phá lưới V.League 1.',
  };
}

export default async function VLeaguePage({
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
    <div>
      {/* Live scores / standings widget (existing) */}
      <LeagueHubClient
        leagueId={LEAGUES.vleague.id}
        leagueName={LEAGUES.vleague.name}
        newsTag="V.League"
      />

      {/* CMS articles section */}
      <div className="border-t border-brand-border mt-6">
        <CmsSectionPage
          endpoint={BanthangVnEndpoints.VLeague}
          title="Tin tức V.League"
          description="Bài viết mới nhất về V.League từ ban biên tập."
          page={page ? Number(page) : 1}
          accentClass="from-brand-red to-brand-red-dark"
          locale={locale}
        />
      </div>
    </div>
  );
}
