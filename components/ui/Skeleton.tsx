import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-700/40',
        className,
      )}
    />
  );
}

interface SkeletonCardProps {
  withImage?: boolean;
  className?: string;
}

export function SkeletonCard({ withImage = true, className }: SkeletonCardProps) {
  return (
    <div className={cn('space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm', className)}>
      {withImage ? <Skeleton className="aspect-video w-full" /> : null}
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

interface SkeletonListProps {
  count?: number;
  className?: string;
  itemClassName?: string;
  withImage?: boolean;
}

export function SkeletonList({ count = 4, className, itemClassName, withImage = true }: SkeletonListProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} withImage={withImage} className={itemClassName} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="hero-gradient animate-pulse">
      <div className="container-fh py-10 sm:py-14">
        <Skeleton className="mb-4 h-6 w-32 bg-white/20" />
        <Skeleton className="mb-3 h-12 w-3/4 max-w-xl bg-white/20" />
        <Skeleton className="mb-6 h-5 w-1/2 max-w-md bg-white/15" />
        <Skeleton className="h-10 w-36 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

export function SkeletonTicker() {
  return (
    <div className="border-y border-brand-border bg-white py-2">
      <div className="container-fh flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-44 shrink-0 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
