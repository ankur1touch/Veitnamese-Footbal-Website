'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/Badge';
import { NewsThumbnail } from '@/components/ui/NewsThumbnail';
import { NewsItemLink } from '@/components/news/NewsItemLink';
import { TeamCrest } from '@/components/ui/TeamCrest';
import type { LiveMatch } from '@/types';
import type { NewsItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export type HeroSlide =
  | { type: 'match'; match: LiveMatch; kickoffLabel: string }
  | { type: 'story'; item: NewsItem }
  | { type: 'wc' };

interface HeroSliderProps {
  slides: HeroSlide[];
}

function slideControlKeyDown(e: React.KeyboardEvent, action: () => void) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    action();
  }
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const t = useTranslations('home.hero');
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(next, 7000);
    return () => window.clearInterval(id);
  }, [count, next]);

  if (count === 0) return null;

  const slide = slides[index];

  return (
    <section className="relative overflow-hidden hero-gradient text-white">
      <div className="container-fh relative py-8 sm:py-12 lg:py-14">
        <div key={index} className="animate-fadeIn">
          {slide.type === 'match' && (
            <div className="grid items-center gap-6 lg:grid-cols-2">
              <div>
                <Badge variant="wc" className="mb-4">
                  {t('featuredMatch')}
                </Badge>
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                  {slide.match.competition}
                </p>
                <div className="mt-4 flex items-center gap-4 sm:gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <TeamCrest teamName={slide.match.homeTeam} crest={slide.match.homeCrest} size="lg" />
                    <span className="font-display text-lg uppercase tracking-wide">{slide.match.homeTeam}</span>
                  </div>
                  <span className="font-display text-4xl text-brand-gold sm:text-5xl">VS</span>
                  <div className="flex flex-col items-center gap-2">
                    <TeamCrest teamName={slide.match.awayTeam} crest={slide.match.awayCrest} size="lg" />
                    <span className="font-display text-lg uppercase tracking-wide">{slide.match.awayTeam}</span>
                  </div>
                </div>
                <Link
                  href={{ pathname: '/tran-dau/[id]', params: { id: String(slide.match.id) } }}
                  className="bdh-pill-btn mt-6 bg-brand-gold text-brand-navy hover:bg-brand-gold-dark"
                >
                  {t('viewMatch')}
                </Link>
              </div>
              <div className="hidden lg:flex lg:justify-end">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{t('kickoff')}</p>
                  <p className="mt-2 font-display text-3xl uppercase" suppressHydrationWarning>
                    {slide.kickoffLabel}
                  </p>
                </div>
              </div>
            </div>
          )}

          {slide.type === 'story' && (
            <div className="grid items-center gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <Badge variant="red" className="mb-4">
                  {t('topStory')}
                </Badge>
                <h1 className="font-display text-3xl uppercase leading-none tracking-wide sm:text-4xl lg:text-5xl">
                  {slide.item.title}
                </h1>
                {slide.item.excerpt && (
                  <p className="mt-4 max-w-2xl text-sm text-white/75 line-clamp-2">{slide.item.excerpt}</p>
                )}
                <NewsItemLink
                  item={slide.item}
                  className="bdh-pill-btn mt-6 inline-flex bg-brand-red text-white hover:bg-brand-red-dark"
                >
                  {t('readStory')}
                </NewsItemLink>
              </div>
              <div className="lg:col-span-2">
                <NewsThumbnail
                  src={slide.item.image}
                  tag={String(slide.item.tag ?? '')}
                  seed={slide.item.id}
                  className="aspect-[16/10] rounded-2xl ring-2 ring-white/10"
                  imgClassName="rounded-2xl"
                />
              </div>
            </div>
          )}

          {slide.type === 'wc' && (
            <div className="max-w-2xl">
              <Badge variant="wc" className="mb-4">
                FIFA 2026
              </Badge>
              <h1 className="font-display text-4xl uppercase leading-none tracking-wide sm:text-5xl lg:text-6xl">
                {t('wcTitle')}
              </h1>
              <p className="mt-4 text-sm text-white/75 sm:text-base">{t('wcSubtitle')}</p>
              <Link
                href="/world-cup"
                className="bdh-pill-btn mt-6 bg-brand-gold text-brand-navy hover:bg-brand-gold-dark"
              >
                {t('wcCta')}
              </Link>
            </div>
          )}
        </div>

        {count > 1 && (
          <>
            <div className="mt-8 flex items-center gap-3" role="tablist" aria-label="Hero slides">
              {slides.map((_, i) => (
                <div
                  key={i}
                  role="tab"
                  tabIndex={0}
                  aria-label={`Slide ${i + 1}`}
                  aria-selected={i === index}
                  onClick={() => setIndex(i)}
                  onKeyDown={(e) => slideControlKeyDown(e, () => setIndex(i))}
                  className={cn(
                    'h-1.5 cursor-pointer rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold',
                    i === index ? 'w-8 bg-brand-gold' : 'w-4 bg-white/30 hover:bg-white/50',
                  )}
                />
              ))}
            </div>
            <div
              role="button"
              tabIndex={0}
              aria-label="Previous slide"
              onClick={prev}
              onKeyDown={(e) => slideControlKeyDown(e, prev)}
              className="absolute left-2 top-1/2 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/20 p-2 hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold sm:block"
            >
              <ChevronLeft className="h-5 w-5" />
            </div>
            <div
              role="button"
              tabIndex={0}
              aria-label="Next slide"
              onClick={next}
              onKeyDown={(e) => slideControlKeyDown(e, next)}
              className="absolute right-2 top-1/2 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/20 p-2 hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold sm:block"
            >
              <ChevronRight className="h-5 w-5" />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default HeroSlider;
