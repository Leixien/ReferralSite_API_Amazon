import useSWR from 'swr';
import { searchProducts } from '@/lib/api';
import type { SearchRequest, SearchResponse } from '@referral-site/shared';

export function useSearch(params: Partial<SearchRequest>) {
  const shouldFetch = params.keywords && params.keywords.length > 0;

  const { data, error, isLoading, mutate } = useSWR<SearchResponse>(
    shouldFetch ? ['search', params] : null,
    () => searchProducts(params as SearchRequest),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
