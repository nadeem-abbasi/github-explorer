import type { FC } from 'react';
import { useMemo, useState } from 'react';
import type { User } from './api/types';
import styles from './App.module.css';
import { UserAccordion } from './components/features/UserAccordion/UserAccordion';
import { Button } from './components/ui/Button/Button';
import { Error } from './components/ui/Error/Error';
import { Header } from './components/ui/Header/Header';
import { Loader } from './components/ui/Loader/Loader';
import { SearchBar } from './components/ui/SearchBar/SearchBar';
import { SearchPlaceholder } from './components/ui/SearchPlaceholder/SearchPlaceholder';
import { useDebounce } from './hooks/useDebounce';
import { useSearchUsers } from './hooks/useSearchUsers';

const SEARCH_DEBOUNCE_MS = 500;

type LoadMoreButtonProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
};

const LoadMoreButton: FC<LoadMoreButtonProps> = ({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}) => {
  if (!hasNextPage) return null;

  return (
    <div className={styles.loadMoreContainer}>
      <Button onClick={onLoadMore} loading={isFetchingNextPage}>
        Load More Users
      </Button>
    </div>
  );
};

type SearchResultsProps = {
  users: User[];
  expandedUserId: number | null;
  onToggle: (userId: number) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
};

const SearchResults: FC<SearchResultsProps> = ({
  users,
  expandedUserId,
  onToggle,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}) => {
  return (
    <>
      <div className={styles.resultsHeader}>
        <h2 className={styles.resultsLabel}>Search Results</h2>
      </div>
      <div className={styles.userList}>
        {users.map((user) => (
          <UserAccordion
            key={user.id}
            user={user}
            isExpanded={expandedUserId === user.id}
            onToggle={() => onToggle(user.id)}
          />
        ))}
      </div>

      <LoadMoreButton
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={onLoadMore}
      />
    </>
  );
};

const App: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchUsers(debouncedQuery);

  const allUsers = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setExpandedUserId(null);
  };

  const handleToggle = (userId: number) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  const handleRetry = () => {
    setSearchQuery('');
    setExpandedUserId(null);
  };

  const showEmptyState = !searchQuery && !isLoading;
  const showNoResults =
    searchQuery && !isLoading && !error && allUsers.length === 0;

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.main}>
        <div className={styles.searchContainer}>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className={styles.content}>
          {showEmptyState && (
            <SearchPlaceholder message="Start by searching for GitHub users" />
          )}

          {showNoResults && (
            <SearchPlaceholder message="No users found matching your search" />
          )}

          {error && (
            <Error
              message={error?.message || 'An error occurred while searching'}
              onRetry={handleRetry}
            />
          )}

          {isLoading && !isFetchingNextPage && (
            <div className={styles.loaderContainer}>
              <Loader size="large" />
            </div>
          )}

          {allUsers.length > 0 && (
            <SearchResults
              users={allUsers}
              expandedUserId={expandedUserId}
              onToggle={handleToggle}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onLoadMore={() => fetchNextPage()}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
