'use client';

import { useState } from 'react';
import Image from 'next/image';
import { playerInitials, initialsAvatarGradient } from '@/lib/player-photo';
import { cn } from '@/lib/utils';

interface PlayerAvatarProps {
  name: string;
  photo?: string;
  teamLogo?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { box: 'h-8 w-8', img: 32, text: 'text-xs', badge: 'h-3.5 w-3.5', badgeImg: 14 },
  md: { box: 'h-20 w-20', img: 80, text: 'text-2xl', badge: 'h-6 w-6', badgeImg: 20 },
  lg: { box: 'h-28 w-28 sm:h-32 sm:w-32', img: 128, text: 'text-3xl sm:text-4xl', badge: 'h-8 w-8', badgeImg: 24 },
};

function photoSrc(url: string): string {
  if (url.startsWith('/api/')) return url;
  if (url.includes('media.api-sports.io') || url.includes('images.fotmob.com')) {
    return `/api/player-photo?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export function PlayerAvatar({ name, photo, teamLogo, size = 'md', className }: PlayerAvatarProps) {
  const s = SIZES[size];
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = Boolean(photo) && !imgFailed;
  const initials = playerInitials(name);
  const gradient = initialsAvatarGradient(name);

  return (
    <div className={cn('relative shrink-0', s.box, className)}>
      <div
        className={cn(
          'relative h-full w-full overflow-hidden rounded-full border-2 border-white shadow-md ring-2 ring-brand-red/20',
        )}
      >
        {showPhoto ? (
          <Image
            src={photoSrc(photo!)}
            alt={name}
            fill
            className="object-cover"
            sizes={`${s.img}px`}
            unoptimized={photo!.includes('dicebear.com')}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-display font-extrabold text-white"
            style={{ background: gradient }}
          >
            <span className={s.text}>{initials}</span>
          </div>
        )}
      </div>

      {teamLogo ? (
        <div
          className={cn(
            'absolute -bottom-0.5 -right-0.5 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm',
            s.badge,
          )}
        >
          <Image
            src={teamLogo}
            alt=""
            width={s.badgeImg}
            height={s.badgeImg}
            className="h-full w-full object-contain p-0.5"
          />
        </div>
      ) : null}
    </div>
  );
}
