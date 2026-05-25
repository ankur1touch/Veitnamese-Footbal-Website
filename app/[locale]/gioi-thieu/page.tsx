import { setRequestLocale } from 'next-intl/server';

export async function generateMetadata() {
  return { title: 'Giới thiệu' };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container-fh py-10 max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-brand-navy">Giới thiệu</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">
        BóngĐáHôm là cổng thông tin bóng đá Việt Nam hàng đầu: V.League, Ngoại hạng Anh, Champions
        League, chuyển nhượng, tỷ số trực tiếp và phân tích. Chúng tôi kết hợp bài viết chuyên sâu
        với tin tức tổng hợp từ các nguồn uy tín trong và ngoài nước.
      </p>
    </div>
  );
}
