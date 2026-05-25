import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LeagueHubClient } from '@/components/league/LeagueHubClient';
import { LEAGUES } from '@/lib/league-config';

export const revalidate = 300;

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'vi' ? 'Ngoại hạng Anh — Premier League' : 'Premier League Hub',
    description: 'Tin tức, bảng xếp hạng, lịch thi đấu và vua phá lưới Ngoại hạng Anh.',
  };
}

export default async function PremierLeaguePage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LeagueHubClient
      leagueId={LEAGUES.epl.id}
      leagueName={LEAGUES.epl.name}
      newsTag="Premier League"
    />
  );
}
