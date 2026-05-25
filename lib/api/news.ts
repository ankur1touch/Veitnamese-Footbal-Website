import { axiosClient } from '../client';
import type { NewsItem } from '@/types';

export async function fetchNews(): Promise<NewsItem[]> {
  const { data } = await axiosClient.post<NewsItem[]>('/api/news', {}, { timeout: 45000 });
  return data;
}

export async function fetchNewsByCategory(category: string): Promise<NewsItem[]> {
  const { data } = await axiosClient.post<NewsItem[]>('/api/news', { category }, { timeout: 45000 });
  return data;
}
