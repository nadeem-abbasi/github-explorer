import { useInfiniteQuery } from '@tanstack/react-query';
import { DEFAULT_PER_PAGE_USERS, QUERY_STALE_TIME } from '../api/config';
import { searchUsers } from '../api/githubApi';
import type { SearchUsersResponse } from '../api/types';

const GITHUB_MAX_RESULTS = 1000;

export const useSearchUsers = (query: string, enabled: boolean = true) =>
  useInfiniteQuery<SearchUsersResponse, Error>({
    queryKey: ['users', 'search', query],
    queryFn: ({ pageParam = 1 }) => searchUsers(query, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalResults = lastPage.total_count;
      const maxPage = Math.ceil(
        Math.min(totalResults, GITHUB_MAX_RESULTS) / DEFAULT_PER_PAGE_USERS,
      );

      return currentPage < maxPage ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: enabled && query.length >= 3,
    staleTime: QUERY_STALE_TIME,
  });
