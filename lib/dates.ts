/** Stable formatted date — safe for SSR and first paint (no Date.now()). */
export function formatAbsoluteTime(
  date: Date | string,
  locale = 'vi-VN',
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';

  return d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const RELATIVE_LABELS: Record<string, { now: string; min: (n: number) => string; hour: (h: number, m: number) => string; day: (d: number) => string }> = {
  'vi-VN': {
    now: 'vừa xong',
    min: (n) => `${n} phút trước`,
    hour: (h, m) => (m > 0 ? `${h} giờ ${m} phút trước` : `${h} giờ trước`),
    day: (d) => `${d} ngày trước`,
  },
  'en-US': {
    now: 'just now',
    min: (n) => `${n} min ago`,
    hour: (h, m) => (m > 0 ? `${h}h ${m}m ago` : `${h}h ago`),
    day: (d) => `${d}d ago`,
  },
};

/** Relative time — only call on the client after mount. */
export function formatRelativeTime(date: Date | string, locale = 'vi-VN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';

  const labels = RELATIVE_LABELS[locale] ?? RELATIVE_LABELS['en-US'];
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return labels.now;
  if (minutes < 60) return labels.min(minutes);
  if (hours < 24) return labels.hour(hours, minutes % 60);
  if (days < 7) return labels.day(days);
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

/** @deprecated Use formatAbsoluteTime */
export const formatAbsoluteTimeEs = formatAbsoluteTime;
/** @deprecated Use formatRelativeTime */
export const formatRelativeTimeEs = formatRelativeTime;
