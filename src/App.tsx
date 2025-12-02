import type { FC } from 'react';
import { useState } from 'react';
import { MAX_DISPLAYED_USERS } from './api/config';
import styles from './App.module.css';
import { SearchContent } from './components/features/SearchContent/SearchContent';
import { Header } from './components/ui/Header/Header';
import { SearchBar } from './components/ui/SearchBar/SearchBar';
import { useDebounce } from './hooks/useDebounce';
import { useSearchUsers } from './hooks/useSearchUsers';

const SEARCH_DEBOUNCE_MS = 500;

const App: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [displayedCount, setDisplayedCount] = useState(MAX_DISPLAYED_USERS);
  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchUsers(debouncedQuery);

  const allUsers = data?.pages.flatMap((page) => page.items) ?? [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setExpandedUserId(null);
    setDisplayedCount(MAX_DISPLAYED_USERS);
  };

  const handleToggle = (userId: number) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  const handleRetry = () => {
    setSearchQuery('');
    setExpandedUserId(null);
    setDisplayedCount(MAX_DISPLAYED_USERS);
  };

  const handleShowMore = () => {
    setDisplayedCount((prev) => prev + MAX_DISPLAYED_USERS);
  };

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.main}>
        <div className={styles.searchContainer}>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className={styles.content}>
          <SearchContent
            searchQuery={searchQuery}
            debouncedQuery={debouncedQuery}
            isLoading={isLoading}
            error={error}
            users={allUsers}
            displayedCount={displayedCount}
            expandedUserId={expandedUserId}
            onToggle={handleToggle}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
            onShowMore={handleShowMore}
            onRetry={handleRetry}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
