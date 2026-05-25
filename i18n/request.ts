import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';
import vi from '../messages/vi.json';
import en from '../messages/en.json';

const MESSAGES: Record<Locale, typeof vi> = { vi, en };

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (routing.locales as readonly string[]).includes(value);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: MESSAGES[locale],
  };
});
