import { useInfiniteQuery, useQuery } from 'react-query';
import { createFetchTrendingReposCreatedFrom } from '../api';
import { getFavouriteRepos } from '../utils/storage';

export function useInfiniteQueryTrendingReposCreatedFrom(lastNumberOfDays: number, reposPerPage: number = 100) {
  const fetch = createFetchTrendingReposCreatedFrom(lastNumberOfDays, reposPerPage);
  return useInfiniteQuery('trendingReposCreatedAfterInclusive', ({ pageParam = 1 }) => fetch(pageParam), {
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.results.length !== 0 ? nextPage : undefined;
    },
  });
}

export function useQuerySavedRepos() {
  return useQuery('savedRepos', () => getFavouriteRepos());
}