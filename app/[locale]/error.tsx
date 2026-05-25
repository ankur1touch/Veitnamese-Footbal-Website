'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-fh py-16 text-center">
      <p className="font-display text-6xl font-extrabold text-brand-red">Error</p>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-brand-navy">
        No pudimos cargar esta página
      </h1>
      <p className="mt-2 text-slate-600">
        Prueba de nuevo. Si el problema continúa, reinicia el servidor de desarrollo.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-brand-red px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-red-dark"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-full border border-brand-border px-6 py-2.5 text-sm font-bold text-brand-navy hover:bg-white"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
