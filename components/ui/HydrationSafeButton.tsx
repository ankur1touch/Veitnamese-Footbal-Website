'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Button that tolerates browser-extension attributes (e.g. fdprocessedid)
 * injected before React hydrates — a common cause of hydration warnings.
 */
export const HydrationSafeButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function HydrationSafeButton({ className, type = 'button', ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      suppressHydrationWarning
      className={cn(className)}
      {...props}
    />
  );
});
