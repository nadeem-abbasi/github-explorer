import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserRepositories } from '../api/githubApi';
import type { RepositoryListResponse } from '../api/types';

/**
 * Hook to fetch user repositories with infinite scrolling
 * @param username - GitHub username
 * @param enabled - Whether the query should be enabled
 * @returns React Query infinite query result
 */
export function useUserRepositories(username: string, enabled: boolean = true) {
  return useInfiniteQuery<RepositoryListResponse, Error>({
    queryKey: ['users', username, 'repositories'],
    queryFn: ({ pageParam = 1 }) =>
      getUserRepositories(username, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      // Return next page number if there are more pages
      return lastPage.hasNextPage ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: enabled && username.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
