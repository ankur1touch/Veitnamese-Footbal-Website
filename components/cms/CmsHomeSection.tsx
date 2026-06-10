import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fetchBanthangVnHomePage, localizeArticles } from '@/lib/banthangVnApi';
import { CmsArticleCard } from '@/components/cms/CmsArticleCard';

interface CmsHomeSectionProps {
  locale: string;
}

export async function CmsHomeSection({ locale }: CmsHomeSectionProps) {
  const res = await fetchBanthangVnHomePage(9);
  const raw = res?.data ?? [];
  const articles = await localizeArticles(raw, locale);

  if (articles.length === 0) return null;

  const [hero, ...rest] = articles;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="bdh-section-title">Tin bóng đá mới nhất</h2>
        <Link
          href="/v-league"
          className="inline-flex items-center gap-1 text-sm font-bold text-brand-red hover:underline"
        >
          Xem thêm
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Hero card */}
      <CmsArticleCard article={hero} variant="hero" />

      {/* 2-col grid for remaining 8 */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rest.slice(0, 8).map((a) => (
            <CmsArticleCard key={a._id} article={a} variant="grid" />
          ))}
        </div>
      )}
    </section>
  );
}
