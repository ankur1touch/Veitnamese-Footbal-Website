import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#D32F2F',
          'red-dark': '#B71C1C',
          'red-light': '#E53935',
          gold: '#F9A825',
          'gold-dark': '#F57F17',
          yellow: '#F9A825',
          'yellow-dark': '#F57F17',
          navy: '#0D1B2A',
          'navy-light': '#1B2838',
          surface: '#F5F5F5',
          border: '#E0E0E0',
          card: '#FFFFFF',
        },
        tag: {
          vleague: '#D32F2F',
          epl: '#1E40AF',
          ucl: '#1E40AF',
          worldcup: '#059669',
          transfers: '#7C3AED',
          analysis: '#0891B2',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'ticker-scroll': 'ticker 40s linear infinite',
        'pulse-live': 'pulse-live 1.5s ease-in-out infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-live': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
