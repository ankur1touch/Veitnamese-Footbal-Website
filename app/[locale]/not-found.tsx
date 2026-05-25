import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <div className="container-fh py-16 text-center">
      <p className="font-display text-7xl font-extrabold text-brand-red">404</p>
      <h1 className="mt-4 font-display text-3xl font-extrabold text-brand-navy">
        {t('title')}
      </h1>
      <p className="mt-2 text-slate-600">{t('message')}</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-brand-red px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-red-dark"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}
