import { useMemo, useState } from 'react';
import styles from './App.module.css';
import { UserAccordion } from './components/features/UserAccordion/UserAccordion';
import { Button } from './components/ui/Button/Button';
import { Error } from './components/ui/Error/Error';
import { Loader } from './components/ui/Loader/Loader';
import { SearchBar } from './components/ui/SearchBar/SearchBar';
import { SearchPlaceholder } from './components/ui/SearchPlaceholder/SearchPlaceholder';
import { useDebounce } from './hooks/useDebounce';
import { useSearchUsers } from './hooks/useSearchUsers';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const debouncedQuery = useDebounce(searchQuery, 500);

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
    setExpandedUserId(null); // Close any open accordion when searching
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
      <header className={styles.header}>
        <h1 className={styles.title}>GitHub User Explorer</h1>
        <p className={styles.subtitle}>
          Search for GitHub users and explore their repositories
        </p>
      </header>

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
              message={
                typeof error === 'object' &&
                error !== null &&
                'message' in error
                  ? (error as Error).message
                  : 'An error occurred while searching'
              }
              onRetry={handleRetry}
            />
          )}

          {isLoading && !isFetchingNextPage && (
            <div className={styles.loaderContainer}>
              <Loader size="large" />
            </div>
          )}

          {allUsers.length > 0 && (
            <>
              <div className={styles.userList}>
                {allUsers.map((user) => (
                  <UserAccordion
                    key={user.id}
                    user={user}
                    isExpanded={expandedUserId === user.id}
                    onToggle={() => handleToggle(user.id)}
                  />
                ))}
              </div>

              {hasNextPage && (
                <div className={styles.loadMoreContainer}>
                  <Button
                    onClick={() => fetchNextPage()}
                    loading={isFetchingNextPage}
                    disabled={isFetchingNextPage}
                  >
                    Load More Users
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
