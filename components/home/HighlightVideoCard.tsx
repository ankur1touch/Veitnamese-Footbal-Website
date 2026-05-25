import { Play } from 'lucide-react';

interface HighlightVideoCardProps {
  title: string;
  subtitle: string;
  duration: string;
  thumbnail?: string;
  href?: string;
}

export function HighlightVideoCard({
  title,
  subtitle,
  duration,
  thumbnail,
  href = '#',
}: HighlightVideoCardProps) {
  return (
    <a
      href={href}
      className="group block overflow-hidden rounded-lg bg-white shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="relative aspect-video overflow-hidden bg-brand-navy">
        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-red shadow-lg transition-transform group-hover:scale-110">
            <Play className="h-5 w-5 fill-current" />
          </div>
        </div>
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-xs font-bold text-white">
          {duration}
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-display text-sm font-bold text-brand-navy line-clamp-2 group-hover:text-brand-red">
          {title}
        </h3>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>
    </a>
  );
}
