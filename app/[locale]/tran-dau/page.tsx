import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { MatchesClient } from '@/components/matches/MatchesClient';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'matches' });
  return { title: t('pageTitle') };
}

export default async function MatchesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MatchesClient />;
}
