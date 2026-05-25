import { Link } from '@/i18n/navigation';
import type { NewsItem } from '@/lib/types';
import type { ReactNode } from 'react';

interface NewsItemLinkProps {
  item: NewsItem;
  className?: string;
  children: ReactNode;
}

/** Locale-aware link: internal MDX articles use i18n routes, external RSS opens in new tab. */
export function NewsItemLink({ item, className, children }: NewsItemLinkProps) {
  if (item.isInternal && item.slug) {
    return (
      <Link
        href={{ pathname: '/tin-tuc/[slug]', params: { slug: item.slug } }}
        className={className}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
