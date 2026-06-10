'use client';

import { useState } from 'react';
import { Link2, Check, Facebook, Twitter, Send } from 'lucide-react';

interface ShareBarProps {
  url: string;
  title: string;
}

export function ShareBar({ url, title }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      icon: <Facebook className="h-4 w-4" />,
      color: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
    },
    {
      label: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
      icon: <Twitter className="h-4 w-4" />,
      color: 'hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]',
    },
    {
      label: 'Telegram',
      href: `https://t.me/share/url?url=${encoded}&text=${encodedTitle}`,
      icon: <Send className="h-4 w-4" />,
      color: 'hover:bg-[#229ED9] hover:text-white hover:border-[#229ED9]',
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select + copy
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-3xl">
      <div className="flex items-center gap-2 flex-wrap border-y border-brand-border py-4">
        <span className="text-sm font-semibold text-slate-500 mr-1">Chia sẻ:</span>

        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${l.label}`}
            className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-all duration-150 ${l.color}`}
          >
            {l.icon}
            <span className="hidden sm:inline">{l.label}</span>
          </a>
        ))}

        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy link"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-brand-navy hover:text-white hover:border-brand-navy"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{copied ? 'Đã sao chép!' : 'Sao chép link'}</span>
        </button>
      </div>
    </div>
  );
}
