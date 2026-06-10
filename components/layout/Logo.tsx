import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  locale?: string;
  className?: string;
}

const ICON_SIZE = { sm: 32, md: 40, lg: 50 } as const;

/* ─────────────────────────────────────────────────────────────
   BtvShield — fixed 48×48 viewBox, scales via width/height.
   Zero text, zero external fonts → always pixel-perfect.
───────────────────────────────────────────────────────────── */
function BtvShield({ px }: { px: number }) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        {/* Shield red gradient — top-left → bottom-right */}
        <linearGradient id="sh-red" x1="4" y1="2" x2="44" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EF5350" />
          <stop offset="0.45" stopColor="#D32F2F" />
          <stop offset="1"    stopColor="#B71C1C" />
        </linearGradient>

        {/* Gold gradient */}
        <linearGradient id="sh-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#FFE082" />
          <stop offset="1" stopColor="#F9A825" />
        </linearGradient>

        {/* Top-left inner highlight */}
        <linearGradient id="sh-shine" x1="0%" y1="0%" x2="50%" y2="100%">
          <stop stopColor="rgba(255,255,255,0.28)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Shield drop-shadow */}
        <filter id="sh-drop" x="-12%" y="-8%" width="124%" height="124%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="rgba(0,0,0,0.40)" />
        </filter>

        {/* Star soft glow */}
        <filter id="sh-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Shield body ── */}
      <g filter="url(#sh-drop)">
        {/* Main fill */}
        <path
          d="M24 1.5 L44 8.5 V24.5 C44 35.8 35.2 44 24 47 C12.8 44 4 35.8 4 24.5 V8.5 Z"
          fill="url(#sh-red)"
        />
        {/* Gold border */}
        <path
          d="M24 1.5 L44 8.5 V24.5 C44 35.8 35.2 44 24 47 C12.8 44 4 35.8 4 24.5 V8.5 Z"
          stroke="url(#sh-gold)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.9"
        />
        {/* Inner shine (top-left) */}
        <path
          d="M24 5 L40.5 11 V24.5 C40.5 33.5 33.5 41 24 43.5 C14.5 41 7.5 33.5 7.5 24.5 V11 Z"
          fill="url(#sh-shine)"
        />
      </g>

      {/* ── Football ── */}
      {/* White circle */}
      <circle cx="24" cy="25" r="10.5" fill="white" opacity="0.97" />

      {/* Classic football stitch pattern in red */}
      {/* Centre pentagon */}
      <polygon points="24,17.5 27.5,20.5 26.2,24.5 21.8,24.5 20.5,20.5" fill="#D32F2F" />
      {/* Surrounding patches — lines from centre pentagon outward */}
      <line x1="24"   y1="17.5" x2="24"   y2="14.5" stroke="#D32F2F" strokeWidth="1.1" />
      <line x1="27.5" y1="20.5" x2="30.2" y2="19"   stroke="#D32F2F" strokeWidth="1.1" />
      <line x1="26.2" y1="24.5" x2="28.5" y2="27"   stroke="#D32F2F" strokeWidth="1.1" />
      <line x1="21.8" y1="24.5" x2="19.5" y2="27"   stroke="#D32F2F" strokeWidth="1.1" />
      <line x1="20.5" y1="20.5" x2="17.8" y2="19"   stroke="#D32F2F" strokeWidth="1.1" />

      {/* ── Gold star — top-right ── */}
      {/* Hand-crafted 5pt star at (39, 7), r=4.5 outer, r=1.9 inner */}
      <path
        d="M39 2.8
           L40.31 6.76 L44.5 6.76
           L41.1 9.18 L42.41 13.14
           L39 10.72 L35.59 13.14
           L36.9 9.18 L33.5 6.76
           L37.69 6.76 Z"
        fill="url(#sh-gold)"
        filter="url(#sh-glow)"
      />

      {/* ── Gold lightning bolt — bottom-right corner ── */}
      <path
        d="M38 27 L34 34 H37.5 L35.5 40.5 L43 31 H39.5 L42 27 Z"
        fill="url(#sh-gold)"
        opacity="0.92"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Logo = Shield icon ONLY. No text, no fonts, always crisp.
   Brand name is shown via the site <title> and header context.
───────────────────────────────────────────────────────────── */
export function Logo({
  size = 'md',
  className,
}: LogoProps) {
  const px = ICON_SIZE[size];

  return (
    <Link
      href="/"
      className={cn('inline-flex shrink-0 items-center', className)}
      aria-label="BanThangVN — Trang chủ"
    >
      <BtvShield px={px} />
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
   LogoMark — same shield, used in footer / loading states.
───────────────────────────────────────────────────────────── */
export function LogoMark({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span className={cn('inline-flex', className)}>
      <BtvShield px={size} />
    </span>
  );
}

export default Logo;
