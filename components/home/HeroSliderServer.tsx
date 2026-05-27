import dynamic from 'next/dynamic';
import { getMatchOfTheDay } from '@/lib/football-api';
import { getArticlesAsNewsItems } from '@/lib/mdx';
import { getLatestNews } from '@/lib/rss';
import { formatMatchKickoff } from '@/lib/dates';
import { SkeletonHero } from '@/components/ui/Skeleton';
import type { HeroSlide } from './HeroSlider';

const HeroSlider = dynamic(() => import('./HeroSlider').then((m) => m.HeroSlider), {
  ssr: true,
  loading: () => <SkeletonHero />,
});

interface HeroSliderServerProps {
  locale: string;
}

export async function HeroSliderServer({ locale }: HeroSliderServerProps) {
  const [match, articles, rss] = await Promise.all([
    getMatchOfTheDay(),
    getArticlesAsNewsItems(locale),
    getLatestNews(5),
  ]);

  const exclusive = articles.find((a) => a.exclusive) ?? articles[0] ?? rss[0];
  const slides: HeroSlide[] = [];

  if (match) {
    slides.push({
      type: 'match',
      match,
      kickoffLabel: formatMatchKickoff(match.utcDate, locale),
    });
  }
  if (exclusive) slides.push({ type: 'story', item: exclusive });
  slides.push({ type: 'wc' });

  return <HeroSlider slides={slides} />;
}

export default HeroSliderServer;
