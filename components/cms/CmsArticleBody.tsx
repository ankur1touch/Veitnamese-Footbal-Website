'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CmsArticleBodyProps {
  html: string;
  className?: string;
}

/**
 * Renders CMS-provided HTML content safely.
 * Scoped prose styles to avoid global pollution.
 */
export function CmsArticleBody({ html, className }: CmsArticleBodyProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Make all external links open in new tab
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
      if (!a.href.startsWith(window.location.origin)) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className={cn(
        'cms-content mx-auto mt-8 max-w-3xl',
        // Prose-style scoped via Tailwind arbitrary selectors
        '[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-brand-navy',
        '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-brand-navy',
        '[&_p]:my-4 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-slate-700',
        '[&_ul]:my-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:text-slate-700',
        '[&_ol]:my-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:text-slate-700',
        '[&_li]:leading-relaxed',
        '[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-red [&_blockquote]:bg-brand-surface [&_blockquote]:p-4 [&_blockquote]:italic [&_blockquote]:text-brand-navy',
        '[&_strong]:font-bold [&_strong]:text-brand-navy',
        '[&_a]:text-brand-red [&_a]:underline-offset-2 [&_a:hover]:underline',
        '[&_img]:my-6 [&_img]:w-full [&_img]:rounded-lg [&_img]:shadow-card',
        '[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_table]:overflow-x-auto',
        '[&_th]:border [&_th]:border-brand-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-brand-navy [&_th]:text-white',
        '[&_td]:border [&_td]:border-brand-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-slate-700',
        className,
      )}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
