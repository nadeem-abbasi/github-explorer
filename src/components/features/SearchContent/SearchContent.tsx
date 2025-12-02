import type { FC } from 'react';
import type { User } from '../../../api/types';
import { Error } from '../../ui/Error/Error';
import { Loader } from '../../ui/Loader/Loader';
import { SearchPlaceholder } from '../../ui/SearchPlaceholder/SearchPlaceholder';
import { SearchResults } from '../SearchResults/SearchResults';
import styles from './SearchContent.module.css';

type SearchContentProps = {
  searchQuery: string;
  debouncedQuery: string;
  isLoading: boolean;
  error: Error | null;
  users: User[];
  displayedCount: number;
  expandedUserId: number | null;
  onToggle: (userId: number) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onShowMore: () => void;
  onRetry: () => void;
};

export const SearchContent: FC<SearchContentProps> = ({
  searchQuery,
  debouncedQuery,
  isLoading,
  error,
  users,
  displayedCount,
  expandedUserId,
  onToggle,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onShowMore,
  onRetry,
}) => {
  const isDebouncing = searchQuery !== debouncedQuery;
  const showLoader =
    (isLoading && users.length === 0) ||
    (isDebouncing && searchQuery.length >= 3);

  if (!searchQuery) {
    return <SearchPlaceholder message="Start by searching for GitHub users" />;
  }

  if (error) {
    return (
      <Error
        message={error?.message || 'An error occurred while searching'}
        onRetry={onRetry}
      />
    );
  }

  if (showLoader) {
    return (
      <div className={styles.loaderContainer}>
        <Loader size="large" />
      </div>
    );
  }

  if (users.length > 0) {
    return (
      <SearchResults
        users={users}
        displayedCount={displayedCount}
        expandedUserId={expandedUserId}
        onToggle={onToggle}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={onLoadMore}
        onShowMore={onShowMore}
      />
    );
  }

  return <SearchPlaceholder message="No users found matching your search" />;
};
