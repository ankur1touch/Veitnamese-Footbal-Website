'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import { HydrationSafeButton } from '@/components/ui/HydrationSafeButton';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const otherLocale = locale === 'vi' ? 'en' : 'vi';

  const switchLocale = () => {
    startTransition(() => {
      router.replace(pathname as '/', { locale: otherLocale });
    });
  };

  return (
    <HydrationSafeButton
      onClick={switchLocale}
      disabled={isPending}
      className={cn(
        'inline-flex items-center gap-1 rounded border border-white/30 px-2.5 py-1 text-xs font-bold text-white hover:bg-white/10 transition-colors',
        isPending && 'opacity-60',
      )}
      aria-label={`Switch to ${otherLocale === 'vi' ? 'Vietnamese' : 'English'}`}
    >
      <span className={locale === 'vi' ? 'text-brand-gold' : ''}>VI</span>
      <span className="opacity-50">/</span>
      <span className={locale === 'en' ? 'text-brand-gold' : ''}>EN</span>
    </HydrationSafeButton>
  );
}
