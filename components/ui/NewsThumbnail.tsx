'use client';

import { useEffect, useMemo, useState } from 'react';
import { getTagFallbackImage, isGenericGoogleNewsImage } from '@/lib/news-images';
import { cn } from '@/lib/utils';

interface NewsThumbnailProps {
  src?: string;
  alt?: string;
  tag?: string;
  seed: string;
  className?: string;
  imgClassName?: string;
}

export function NewsThumbnail({
  src,
  alt = '',
  tag,
  seed,
  className,
  imgClassName,
}: NewsThumbnailProps) {
  const fallback = useMemo(
    () => getTagFallbackImage(String(tag ?? ''), seed),
    [tag, seed],
  );
  const [current, setCurrent] = useState(() => src || fallback);
  const [failedPrimary, setFailedPrimary] = useState(!src);

  useEffect(() => {
    if (src && !isGenericGoogleNewsImage(src)) {
      setCurrent(src);
      setFailedPrimary(false);
    } else {
      setCurrent(fallback);
      setFailedPrimary(true);
    }
  }, [src, fallback]);

  function handleError() {
    if (!failedPrimary && src) {
      setFailedPrimary(true);
      setCurrent(fallback);
      return;
    }
    if (current !== fallback) {
      setCurrent(fallback);
    }
  }

  return (
    <div className={cn('relative overflow-hidden bg-brand-surface', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current}
        alt={alt}
        className={cn('h-full w-full object-cover', imgClassName)}
        loading="lazy"
        decoding="async"
        onError={handleError}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}
