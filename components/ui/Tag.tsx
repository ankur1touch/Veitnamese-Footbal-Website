import { cn } from '@/lib/utils';

const TAG_COLORS: Record<string, string> = {
  'V.League': 'bg-brand-red',
  'Premier League': 'bg-blue-800',
  'Champions': 'bg-indigo-700',
  'UCL': 'bg-indigo-700',
  'World Cup': 'bg-emerald-700',
  'Transfers': 'bg-violet-700',
  'La Liga': 'bg-orange-700',
  'Fichajes': 'bg-violet-700',
  'Análisis': 'bg-cyan-700',
};

interface TagProps {
  label: string;
  className?: string;
}

export function Tag({ label, className }: TagProps) {
  const color = TAG_COLORS[label] || 'bg-brand-navy border border-white/20';
  return (
    <span className={cn('tag-pill', color, className)}>
      {label}
    </span>
  );
}
