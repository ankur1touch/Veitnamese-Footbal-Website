import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LeagueHubClient } from '@/components/league/LeagueHubClient';
import { LEAGUES } from '@/lib/league-config';

export const revalidate = 300;

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'vi' ? 'V.League 1 — Bóng đá Việt Nam' : 'V.League 1 — Vietnamese Football',
    description: 'Tin tức, bảng xếp hạng, lịch thi đấu và vua phá lưới V.League 1.',
  };
}

export default async function VLeaguePage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LeagueHubClient
      leagueId={LEAGUES.vleague.id}
      leagueName={LEAGUES.vleague.name}
      newsTag="V.League"
    />
  );
}
