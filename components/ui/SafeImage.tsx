'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const ALLOWED_HOSTS = new Set([
  '90min.com',
  'goal.com',
  'bbc.co.uk',
  'skysports.com',
  'flashscore.com',
  'worldsoccer.com',
  'images.unsplash.com',
  'crests.football-data.org',
  'media.api-sports.io',
  'api.dicebear.com',
  'images.fotmob.com',
  'i.imgur.com',
]);

function isAllowedSrc(src: string): boolean {
  try {
    const url = new URL(src);
    if (url.protocol !== 'https:') return false;
    const host = url.hostname.replace(/^www\./, '');
    for (const allowed of ALLOWED_HOSTS) {
      if (host === allowed || host.endsWith(`.${allowed}`)) return true;
    }
    return false;
  } catch {
    return false;
  }
}

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src?: string | null;
  fallback?: string;
  imgClassName?: string;
}

export function SafeImage({
  src,
  fallback = 'https://images.unsplash.com/photo-1574629810360-7efbbe195778?w=800&q=80',
  alt = '',
  className,
  imgClassName,
  fill,
  width,
  height,
  ...rest
}: SafeImageProps) {
  const primary = src && isAllowedSrc(src) ? src : fallback;
  const [current, setCurrent] = useState(primary);

  function handleError() {
    if (current !== fallback) setCurrent(fallback);
  }

  const imageProps = {
    src: current,
    alt,
    className: cn('object-cover', imgClassName),
    onError: handleError,
    ...rest,
  };

  if (fill) {
    return (
      <div className={cn('relative overflow-hidden bg-brand-surface', className)}>
        <Image fill {...imageProps} />
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden bg-brand-surface', className)}>
      <Image width={width ?? 400} height={height ?? 300} {...imageProps} />
    </div>
  );
}

export default SafeImage;
