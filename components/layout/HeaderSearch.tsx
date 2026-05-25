'use client';

import { FormEvent, useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

export function HeaderSearch() {
  const t = useTranslations('search');
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push({ pathname: '/tim-kiem', query: { q: trimmed } });
    setQuery('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      suppressHydrationWarning
      className="flex min-w-0 flex-1 max-w-[160px] items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 sm:max-w-xs lg:max-w-sm focus-within:border-brand-gold focus-within:ring-1 focus-within:ring-brand-gold/50 transition-all"
      role="search"
    >
      <Search className="h-4 w-4 shrink-0 text-white/60" aria-hidden />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('placeholderShort')}
        autoComplete="off"
        data-lpignore="true"
        data-form-type="other"
        suppressHydrationWarning
        className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
        aria-label={t('placeholder')}
      />
    </form>
  );
}

export default HeaderSearch;
