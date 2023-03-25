import { useInfiniteQuery } from 'react-query';
import { createFetchTrendingReposCreatedFrom } from '../api';

export function useInfiniteQueryTrendingReposCreatedFrom(lastNumberOfDays: number, reposPerPage: number = 100) {
  const fetch = createFetchTrendingReposCreatedFrom(lastNumberOfDays, reposPerPage);
  return useInfiniteQuery('trendingReposCreatedAfterInclusive', ({ pageParam = 1 }) => fetch(pageParam), {
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.results.length !== 0 ? nextPage : undefined;
    },
  });
}
