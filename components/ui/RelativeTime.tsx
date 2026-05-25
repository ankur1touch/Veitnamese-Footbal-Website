'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { formatAbsoluteTime, formatRelativeTime } from '@/lib/dates';
import { cn } from '@/lib/utils';

interface RelativeTimeProps {
  date: string | Date;
  className?: string;
  /** Show relative phrasing after mount; until then uses absolute date. */
  relative?: boolean;
}

function dateLocale(locale: string): string {
  return locale === 'vi' ? 'vi-VN' : 'en-US';
}

export function RelativeTime({ date, className, relative = true }: RelativeTimeProps) {
  const locale = useLocale();
  const dateLoc = dateLocale(locale);
  const iso = typeof date === 'string' ? date : date.toISOString();
  const [label, setLabel] = useState(() => formatAbsoluteTime(date, dateLoc));

  useEffect(() => {
    if (!relative) return;
    const update = () => setLabel(formatRelativeTime(date, dateLoc));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [iso, relative, date, dateLoc]);

  return (
    <time dateTime={iso} className={cn(className)} suppressHydrationWarning>
      {label}
    </time>
  );
}
