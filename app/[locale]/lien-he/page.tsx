import { setRequestLocale } from 'next-intl/server';

export async function generateMetadata() {
  return { title: 'Liên hệ' };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container-fh py-10 max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-brand-navy">Liên hệ</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">
        Gửi ý kiến, góp ý hoặc hợp tác qua email:{' '}
        <a href="mailto:lienhe@bongdahom.net" className="font-semibold text-brand-red hover:underline">
          lienhe@bongdahom.net
        </a>
      </p>
    </div>
  );
}
