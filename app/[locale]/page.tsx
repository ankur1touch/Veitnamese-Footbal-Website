import { setRequestLocale } from 'next-intl/server';
import { HomeNewsClient } from '@/components/home/HomeNewsClient';
import { LeagueStrip } from '@/components/home/LeagueStrip';
import { LiveScoresWidget } from '@/components/sidebar/LiveScoresWidget';
import { HomeSidebarData } from '@/components/sidebar/HomeSidebarData';

export const revalidate = 300;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container-fh py-6">
      <LeagueStrip />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="xl:col-span-8">
          <HomeNewsClient />
        </section>

        <aside className="xl:col-span-4 space-y-4 xl:sticky xl:top-[120px] xl:self-start">
          <LiveScoresWidget />
          <HomeSidebarData />
        </aside>
      </div>
    </div>
  );
}
