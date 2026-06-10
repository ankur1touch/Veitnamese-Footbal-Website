'use client';

import Link from 'next/link';
import { Link as IntlLink } from '@/i18n/navigation';
import type { NewsItem } from '@/lib/types';
import type { ReactNode } from 'react';

interface NewsItemLinkProps {
  item: NewsItem;
  className?: string;
  children: ReactNode;
}

/**
 * Smart link component:
 * - CMS articles (/bai-viet/...) → Next.js Link (locale-agnostic CMS route)
 * - Internal MDX articles (/tin-tuc/...) → next-intl Link (locale-aware)
 * - External RSS → <a target="_blank">
 */
export function NewsItemLink({ item, className, children }: NewsItemLinkProps) {
  // CMS article — url is /bai-viet/<slug>
  if (item.isInternal && item.url?.startsWith('/bai-viet/')) {
    return (
      <Link href={item.url} className={className}>
        {children}
      </Link>
    );
  }

  // Internal MDX article
  if (item.isInternal && item.slug) {
    return (
      <IntlLink
        href={{ pathname: '/tin-tuc/[slug]', params: { slug: item.slug } }}
        className={className}
      >
        {children}
      </IntlLink>
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
