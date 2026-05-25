import { setRequestLocale } from 'next-intl/server';

export async function generateMetadata() {
  return { title: 'Quảng cáo' };
}

export default async function AdsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container-fh py-10 max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-brand-navy">Quảng cáo</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">
        Hợp tác quảng cáo trên BóngĐáHôm — liên hệ:{' '}
        <a href="mailto:ads@bongdahom.net" className="text-brand-red hover:underline">
          ads@bongdahom.net
        </a>
      </p>
    </div>
  );
}
