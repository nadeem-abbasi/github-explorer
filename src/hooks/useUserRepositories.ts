import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_STALE_TIME } from '../api/config';
import { getUserRepositories } from '../api/githubApi';
import type { RepositoryListResponse } from '../api/types';

export const useUserRepositories = (
  username: string,
  enabled: boolean = true,
) =>
  useInfiniteQuery<RepositoryListResponse, Error>({
    queryKey: ['users', username, 'repositories'],
    queryFn: ({ pageParam = 1 }) =>
      getUserRepositories(username, pageParam as number),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: enabled && username.trim().length > 0,
    staleTime: QUERY_STALE_TIME,
  });
