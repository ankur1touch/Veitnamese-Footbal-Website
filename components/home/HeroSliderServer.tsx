import dynamic from 'next/dynamic';
import { getMatchOfTheDay } from '@/lib/football-api';
import { fetchBanthangVnHomePage, banthangVnToNewsItem } from '@/lib/banthangVnApi';
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
  const [match, cmsRes] = await Promise.all([
    getMatchOfTheDay(),
    fetchBanthangVnHomePage(5),
  ]);

  const storyItems = (cmsRes?.data ?? []).map(banthangVnToNewsItem);
  const slides: HeroSlide[] = [];

  if (match) {
    slides.push({
      type: 'match',
      match,
      kickoffLabel: formatMatchKickoff(match.utcDate, locale),
    });
  }

  // First CMS article as main story slide
  if (storyItems[0]) slides.push({ type: 'story', item: storyItems[0] });

  // Next 2 CMS articles as extra slides
  storyItems.slice(1, 3).forEach((item) => {
    slides.push({ type: 'story', item });
  });

  slides.push({ type: 'wc' });

  return <HeroSlider slides={slides} />;
}

export default HeroSliderServer;
