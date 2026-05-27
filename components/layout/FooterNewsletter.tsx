'use client';

import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HydrationSafeButton } from '@/components/ui/HydrationSafeButton';

export function FooterNewsletter() {
  const t = useTranslations('footer.newsletter');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-gold">{t('title')}</h4>
      <p className="mb-3 text-sm text-white/60">{t('subtitle')}</p>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        {submitted ? (
          <div className="flex items-center gap-2 rounded-xl bg-brand-gold/20 px-4 py-2.5 text-sm font-bold text-brand-gold">
            <Check className="h-4 w-4" />
            {t('success')}
          </div>
        ) : (
          <>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('placeholder')}
              suppressHydrationWarning
              autoComplete="email"
              className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-brand-gold focus:outline-none"
            />
            <HydrationSafeButton
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-sm font-bold text-brand-navy hover:bg-brand-gold-dark transition-colors"
            >
              <Mail className="h-4 w-4" />
              {t('cta')}
            </HydrationSafeButton>
          </>
        )}
      </form>
    </div>
  );
}

export default FooterNewsletter;
