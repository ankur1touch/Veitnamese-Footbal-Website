'use client';

import Image from 'next/image';
import { useState } from 'react';
import { resolveTeamBrand } from '@/lib/team-logos';
import { cn } from '@/lib/utils';

interface TeamCrestProps {
  teamName: string;
  crest?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { box: 'h-7 w-7', img: 28, text: 'text-[9px]' },
  md: { box: 'h-9 w-9 sm:h-10 sm:w-10', img: 40, text: 'text-[10px]' },
  lg: { box: 'h-12 w-12 sm:h-14 sm:w-14', img: 56, text: 'text-xs' },
};

export function TeamCrest({ teamName, crest, size = 'md', className }: TeamCrestProps) {
  const brand = resolveTeamBrand(teamName, crest);
  const [failed, setFailed] = useState(false);
  const s = SIZES[size];
  const showImage = brand.crest && !failed;

  if (showImage) {
    return (
      <div
        className={cn(
          'relative shrink-0 rounded-full bg-white p-0.5 shadow-sm ring-1 ring-black/5',
          s.box,
          className,
        )}
      >
        <Image
          src={brand.crest!}
          alt=""
          width={s.img}
          height={s.img}
          className="h-full w-full rounded-full object-contain"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-display font-extrabold text-white shadow-sm ring-2 ring-white/20',
        s.box,
        s.text,
        className,
      )}
      style={{ backgroundColor: brand.color }}
      aria-hidden
    >
      {brand.abbr}
    </span>
  );
}
