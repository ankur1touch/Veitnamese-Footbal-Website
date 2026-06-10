import Link from 'next/link';
import Image from 'next/image';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { Tag } from '@/components/ui/Tag';
import { banthangVnThumb, type BanthangVnArticle } from '@/lib/banthangVnApi';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1574629810360-7efbbe195778?w=800&q=80';

interface CmsArticleCardProps {
  article: BanthangVnArticle;
  variant?: 'grid' | 'list' | 'hero';
}

export function CmsArticleCard({ article, variant = 'list' }: CmsArticleCardProps) {
  const thumb = banthangVnThumb(article) || FALLBACK_IMG;
  const primaryCategory = article.category?.[0] ?? article.endpointAssignments?.[0]?.name ?? '';
  const href = `/bai-viet/${article.slug}`;

  if (variant === 'hero') {
    return (
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-shadow"
      >
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={thumb}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 60vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {primaryCategory && <Tag label={primaryCategory} className="mb-2" />}
          <h2 className="font-display text-xl font-extrabold leading-snug text-white line-clamp-3 md:text-2xl">
            {article.title}
          </h2>
          {article.summary && (
            <p className="mt-2 text-sm leading-relaxed text-white/80 line-clamp-2">
              {article.summary}
            </p>
          )}
          <p className="mt-3 text-xs text-white/60 uppercase tracking-wide">
            <RelativeTime date={article.createdAt} />
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'grid') {
    return (
      <Link
        href={href}
        className="group bdh-card-light flex flex-col overflow-hidden hover:shadow-card-hover transition-shadow"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={thumb}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
          {primaryCategory && (
            <span className="absolute top-2 left-2 z-10">
              <Tag label={primaryCategory} />
            </span>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-display text-sm font-bold leading-snug text-brand-navy group-hover:text-brand-red line-clamp-3 flex-1">
            {article.title}
          </h3>
          {article.summary && (
            <p className="mt-2 text-xs text-slate-500 line-clamp-2">{article.summary}</p>
          )}
          <p className="mt-3 text-[10px] text-slate-400 uppercase tracking-wide">
            <RelativeTime date={article.createdAt} />
          </p>
        </div>
      </Link>
    );
  }

  // list variant
  return (
    <Link
      href={href}
      className="group flex gap-4 bdh-accent-border py-3 hover:bg-white/60 -mx-1 px-1 rounded-r-lg transition-colors"
    >
      <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden sm:h-[72px] sm:w-[72px]">
        <Image
          src={thumb}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="80px"
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col justify-center min-w-0">
        <div className="mb-1 flex items-center gap-2">
          {primaryCategory && <Tag label={primaryCategory} />}
        </div>
        <h3 className="font-semibold text-sm leading-snug text-brand-navy group-hover:text-brand-red line-clamp-2">
          {article.title}
        </h3>
        <p className="mt-1 text-[11px] text-slate-400">
          <RelativeTime date={article.createdAt} />
        </p>
      </div>
    </Link>
  );
}
