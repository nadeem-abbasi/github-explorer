import { useInfiniteQuery } from '@tanstack/react-query';
import { searchUsers } from '../api/githubApi';
import type { SearchUsersResponse } from '../api/types';

/**
 * Hook to search GitHub users with infinite scrolling
 * @param query - Search query string
 * @param enabled - Whether the query should be enabled
 * @returns React Query infinite query result
 */
export function useSearchUsers(query: string, enabled: boolean = true) {
  return useInfiniteQuery<SearchUsersResponse, Error>({
    queryKey: ['users', 'search', query],
    queryFn: ({ pageParam = 1 }) => searchUsers(query, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      // GitHub API returns up to 1000 results (page 34 with per_page=30)
      const currentPage = allPages.length;
      const totalResults = lastPage.total_count;
      const resultsPerPage = 30;
      const maxPage = Math.ceil(Math.min(totalResults, 1000) / resultsPerPage);

      return currentPage < maxPage ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: enabled && query.length >= 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
