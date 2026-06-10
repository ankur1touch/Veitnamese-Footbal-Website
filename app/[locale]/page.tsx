import { setRequestLocale } from 'next-intl/server';
import { HomeNewsClient } from '@/components/home/HomeNewsClient';
import { HeroSliderServer } from '@/components/home/HeroSliderServer';
import { MatchTickerStripServer } from '@/components/home/MatchTickerStripServer';
import { MatchOfTheDay } from '@/components/home/MatchOfTheDay';
import { UpcomingMatchesStripServer } from '@/components/home/UpcomingMatchesStripServer';
import { TournamentsSection } from '@/components/home/TournamentsSection';
import { FanZoneStrip } from '@/components/home/FanZoneStrip';
import { LiveScoresWidget } from '@/components/sidebar/LiveScoresWidget';
import { HomeSidebarData } from '@/components/sidebar/HomeSidebarData';
import { FifaRankingsWidget } from '@/components/sidebar/FifaRankingsWidget';
import { CmsHomeSection } from '@/components/cms/CmsHomeSection';

export const revalidate = 300;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSliderServer locale={locale} />
      <MatchTickerStripServer />

      <div className="container-fh space-y-8 py-6">
        <MatchOfTheDay />
        <UpcomingMatchesStripServer />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <section className="xl:col-span-8 space-y-10">
            <HomeNewsClient />
            <CmsHomeSection locale={locale} />
          </section>

          <aside className="space-y-4 xl:col-span-4 xl:sticky xl:top-[120px] xl:self-start">
            <LiveScoresWidget />
            <HomeSidebarData />
            <FifaRankingsWidget />
          </aside>
        </div>

        <TournamentsSection />
        <FanZoneStrip />
      </div>
    </>
  );
}
