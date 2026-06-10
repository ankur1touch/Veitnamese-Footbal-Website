'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface CmsPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function CmsPagination({ currentPage, totalPages }: CmsPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function go(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2,
  );

  return (
    <nav
      aria-label="Phân trang"
      className="mt-10 flex items-center justify-center gap-1 flex-wrap"
    >
      <button
        onClick={() => go(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'rounded-full px-4 py-1.5 text-sm font-semibold transition-all',
          currentPage <= 1
            ? 'cursor-not-allowed text-slate-300'
            : 'text-brand-navy hover:bg-brand-surface',
        )}
      >
        ← Trước
      </button>

      {visible.map((p, i) => {
        const prev = visible[i - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1">
            {showEllipsis && <span className="px-1 text-slate-400">…</span>}
            <button
              onClick={() => go(p)}
              className={cn(
                'h-9 w-9 rounded-full text-sm font-semibold transition-all',
                p === currentPage
                  ? 'bg-brand-red text-white shadow-md'
                  : 'text-brand-navy hover:bg-brand-surface',
              )}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => go(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'rounded-full px-4 py-1.5 text-sm font-semibold transition-all',
          currentPage >= totalPages
            ? 'cursor-not-allowed text-slate-300'
            : 'text-brand-navy hover:bg-brand-surface',
        )}
      >
        Sau →
      </button>
    </nav>
  );
}
