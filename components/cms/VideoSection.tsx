'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoEmbedProps {
  url: string;
  title?: string;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function VideoEmbed({ url, title }: VideoEmbedProps) {
  const [active, setActive] = useState(false);
  const ytId = getYouTubeId(url);

  if (!ytId) return null;

  const thumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;

  return (
    <div className="my-4 overflow-hidden rounded-xl shadow-card">
      {active ? (
        <div className="relative aspect-video w-full">
          <iframe
            src={embedUrl}
            title={title ?? 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group relative block w-full aspect-video overflow-hidden bg-slate-900 cursor-pointer"
          aria-label={`Play video${title ? `: ${title}` : ''}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt={title ?? 'Video thumbnail'}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-red shadow-lg transition-transform duration-200 group-hover:scale-110">
              <Play className="h-7 w-7 text-white fill-white ml-1" />
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

interface VideoSectionProps {
  videoUrls: string[];
  label?: string;
}

export function VideoSection({ videoUrls, label = 'Video liên quan' }: VideoSectionProps) {
  const valid = videoUrls.filter((u) => getYouTubeId(u));
  if (valid.length === 0) return null;

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <h2 className="mb-4 font-display text-xl font-extrabold text-brand-navy flex items-center gap-2">
        <span className="inline-block w-1 h-6 bg-brand-red rounded-full" />
        {label}
      </h2>
      <div className={valid.length === 1 ? '' : 'grid gap-4 sm:grid-cols-2'}>
        {valid.map((url) => (
          <VideoEmbed key={url} url={url} />
        ))}
      </div>
    </div>
  );
}
