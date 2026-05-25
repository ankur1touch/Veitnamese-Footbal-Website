'use client';

import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HydrationSafeButton } from '@/components/ui/HydrationSafeButton';

export function NewsletterCTA() {
  const t = useTranslations('home');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-brand-red to-brand-red-dark text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-gold" />
        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-brand-gold" />
      </div>
      <div className="container-fh relative py-10">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gold text-brand-navy shadow-lg">
            <Mail className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-2xl font-extrabold">
              {t('latestNews')}
            </h3>
            <p className="mt-1 text-sm text-white/80">
              Nhận tin bóng đá V.League, Ngoại hạng Anh và World Cup mỗi ngày.
            </p>
          </div>
          <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2 md:w-auto">
            {submitted ? (
              <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold px-5 py-3 text-sm font-bold text-brand-navy">
                <Check className="h-4 w-4" />
                Đã đăng ký!
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  suppressHydrationWarning
                  autoComplete="email"
                  className="flex-1 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-brand-gold focus:outline-none"
                />
                <HydrationSafeButton
                  type="submit"
                  className="rounded-xl bg-brand-gold px-5 py-3 text-sm font-bold text-brand-navy hover:bg-brand-gold-dark transition-colors"
                >
                  Đăng ký
                </HydrationSafeButton>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
