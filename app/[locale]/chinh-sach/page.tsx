import { setRequestLocale } from 'next-intl/server';

export async function generateMetadata() {
  return { title: 'Chính sách bảo mật' };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container-fh py-10 max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-brand-navy">Chính sách bảo mật</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">
        BóngĐáHôm tôn trọng quyền riêng tư của bạn. Chúng tôi không bán dữ liệu cá nhân. Cookie phân
        tích (nếu có) chỉ dùng để cải thiện trải nghiệm. Liên hệ:{' '}
        <a href="mailto:privacy@bongdahom.net" className="text-brand-red hover:underline">
          privacy@bongdahom.net
        </a>
      </p>
    </div>
  );
}
