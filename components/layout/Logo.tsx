import Image from 'next/image';
import { Link } from '@/i18n/navigation';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'light', size = 'md' }: LogoProps) {
  const heights = { sm: 28, md: 36, lg: 44 };
  const h = heights[size];

  if (variant === 'light') {
    return (
      <Link href="/" className="flex shrink-0 items-center gap-2.5">
        <LogoIcon size={size} />
        <Wordmark variant="light" size={size} />
      </Link>
    );
  }

  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5">
      <LogoIcon size={size} />
      <Wordmark variant="dark" size={size} />
    </Link>
  );
}

function LogoIcon({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 28, md: 36, lg: 44 };
  const s = sizes[size];

  return (
    <div className="relative shrink-0" style={{ width: s, height: s }}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-md">
        <defs>
          <linearGradient id="lg-shield" x1="6" y1="2" x2="42" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E53935" />
            <stop offset="1" stopColor="#B71C1C" />
          </linearGradient>
          <linearGradient id="lg-gold" x1="34" y1="4" x2="42" y2="14" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD54F" />
            <stop offset="1" stopColor="#F9A825" />
          </linearGradient>
        </defs>
        <path
          d="M24 3L42 9V23C42 33.5 34 41.5 24 45C14 41.5 6 33.5 6 23V9L24 3Z"
          fill="url(#lg-shield)"
          stroke="#F9A825"
          strokeWidth="1.2"
          strokeOpacity="0.7"
        />
        <circle cx="24" cy="24" r="11" fill="white" />
        <path d="M24 15L27.5 20H20.5L24 15Z" fill="#D32F2F" />
        <path d="M20.5 20L24 24.5L17 24.5L20.5 20Z" fill="#D32F2F" />
        <path d="M27.5 20L31 24.5L24 24.5L27.5 20Z" fill="#D32F2F" />
        <path d="M17 24.5L20.5 29L24 24.5L17 24.5Z" fill="#D32F2F" />
        <path d="M31 24.5L27.5 29L24 24.5L31 24.5Z" fill="#D32F2F" />
        <path d="M20.5 29L24 33L27.5 29H20.5Z" fill="#D32F2F" />
        <path
          d="M38 5L39.2 8.5L42.5 8.5L39.8 10.8L40.8 14L38 12L35.2 14L36.2 10.8L33.5 8.5L36.8 8.5L38 5Z"
          fill="url(#lg-gold)"
        />
      </svg>
    </div>
  );
}

function Wordmark({ variant, size }: { variant: 'light' | 'dark'; size: 'sm' | 'md' | 'lg' }) {
  const textSizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-xl' };
  const tagSizes = { sm: 'text-[7px]', md: 'text-[8px]', lg: 'text-[9px]' };
  const color = variant === 'light' ? 'text-white' : 'text-brand-navy';
  const tagColor = variant === 'light' ? 'text-white/50' : 'text-slate-400';

  return (
    <div className="flex flex-col leading-none">
      <span className={`font-display font-extrabold tracking-tight ${textSizes[size]} ${color}`}>
        Bóng<span className="text-brand-gold">Đá</span>Hôm
      </span>
      <span className={`mt-0.5 font-semibold uppercase tracking-[0.2em] ${tagSizes[size]} ${tagColor}`}>
        Football Daily
      </span>
    </div>
  );
}

/** Compact logo mark for footer / favicon contexts */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-mark.svg"
      alt="BóngĐáHôm"
      width={40}
      height={40}
      className={className}
      priority
    />
  );
}
