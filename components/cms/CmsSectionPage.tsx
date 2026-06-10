import { fetchBanthangVnArticlesByEndpoint, localizeArticles, type BanthangVnEndpointName } from '@/lib/banthangVnApi';
import { CmsArticleCard } from '@/components/cms/CmsArticleCard';
import { CmsPagination } from '@/components/cms/CmsPagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';

interface CmsSectionPageProps {
  endpoint: BanthangVnEndpointName;
  title: string;
  description?: string;
  page?: number;
  accentClass?: string;
  locale?: string;
}

export async function CmsSectionPage({
  endpoint,
  title,
  description,
  page = 1,
  accentClass = 'from-brand-navy to-brand-navy/80',
  locale = 'vi',
}: CmsSectionPageProps) {
  const res = await fetchBanthangVnArticlesByEndpoint(endpoint, { page, limit: 20 });

  const raw = res?.data ?? [];
  const articles = await localizeArticles(raw, locale);
  const meta = res?.meta;

  return (
    <div>
      <header className={`bg-gradient-to-r ${accentClass} py-10`}>
        <div className="container-fh">
          <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">{title}</h1>
          {description && (
            <p className="mt-2 max-w-xl text-sm text-white/75">{description}</p>
          )}
        </div>
      </header>

      <div className="container-fh py-8">
        {articles.length === 0 && (
          <EmptyState title="Chưa có bài viết" message="Nội dung sẽ sớm được cập nhật." />
        )}

        {articles.length > 0 && (
          <>
            {/* Hero card — first article */}
            <div className="mb-8">
              <CmsArticleCard article={articles[0]} variant="hero" />
            </div>

            {/* Grid — articles 1–8 */}
            {articles.length > 1 && (
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {articles.slice(1, 9).map((a) => (
                  <CmsArticleCard key={a._id} article={a} variant="grid" />
                ))}
              </div>
            )}

            {/* List — remaining articles */}
            {articles.length > 9 && (
              <div className="bdh-card-light p-4 divide-y divide-brand-border/50">
                {articles.slice(9).map((a) => (
                  <CmsArticleCard key={a._id} article={a} variant="list" />
                ))}
              </div>
            )}

            {meta && meta.totalPages > 1 && (
              <CmsPagination currentPage={meta.currentPage} totalPages={meta.totalPages} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** Skeleton placeholder used as Suspense fallback. */
export function CmsSectionPageSkeleton({ title }: { title: string }) {
  return (
    <div>
      <header className="bg-brand-navy py-10">
        <div className="container-fh">
          <h1 className="font-display text-4xl font-extrabold text-white">{title}</h1>
        </div>
      </header>
      <div className="container-fh py-8">
        <div className="mb-8 aspect-[16/9] w-full animate-pulse rounded-2xl bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
