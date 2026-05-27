'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MatchCountdownProps {
  kickoff: string;
  className?: string;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function MatchCountdown({ kickoff, className }: MatchCountdownProps) {
  const [parts, setParts] = useState<{ h: string; m: string; s: string } | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const target = new Date(kickoff).getTime();

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        setStarted(true);
        setParts(null);
        return;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      setParts({ h: pad(h), m: pad(m), s: pad(s) });
    }

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [kickoff]);

  if (started) {
    return (
      <p className={cn('text-sm font-bold uppercase tracking-widest text-brand-gold', className)}>
        Kick-off
      </p>
    );
  }

  if (!parts) {
    return <div className={cn('h-10 w-40 animate-pulse rounded-lg bg-white/10', className)} />;
  }

  return (
    <div className={cn('flex items-center gap-2 font-mono text-2xl font-bold tabular-nums text-white', className)}>
      <span className="rounded-lg bg-white/10 px-3 py-1">{parts.h}</span>
      <span className="text-brand-gold">:</span>
      <span className="rounded-lg bg-white/10 px-3 py-1">{parts.m}</span>
      <span className="text-brand-gold">:</span>
      <span className="rounded-lg bg-white/10 px-3 py-1">{parts.s}</span>
    </div>
  );
}

export default MatchCountdown;
