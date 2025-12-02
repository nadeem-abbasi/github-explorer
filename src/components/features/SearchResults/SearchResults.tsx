import type { FC } from 'react';
import type { User } from '../../../api/types';
import { LoadMoreButton } from '../../ui/LoadMoreButton/LoadMoreButton';
import { UserAccordion } from '../UserAccordion/UserAccordion';
import styles from './SearchResults.module.css';

export type SearchResultsProps = {
  users: User[];
  displayedCount: number;
  expandedUserId: number | null;
  onToggle: (userId: number) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onShowMore: () => void;
};

export const SearchResults: FC<SearchResultsProps> = ({
  users,
  displayedCount,
  expandedUserId,
  onToggle,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onShowMore,
}) => {
  const displayedUsers = users.slice(0, displayedCount);
  const hasMoreToShow = displayedCount < users.length;
  const needsMoreData = !hasMoreToShow && hasNextPage;

  const handleLoadMore = () => {
    if (needsMoreData) {
      onLoadMore();
    } else {
      onShowMore();
    }
  };

  return (
    <>
      <div className={styles.resultsHeader}>
        <h2 className={styles.resultsLabel}>Search Results</h2>
      </div>
      <div className={styles.userList}>
        {displayedUsers.map((user) => (
          <UserAccordion
            key={user.id}
            user={user}
            isExpanded={expandedUserId === user.id}
            onToggle={() => onToggle(user.id)}
          />
        ))}
      </div>

      <LoadMoreButton
        hasNextPage={hasMoreToShow || hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
        label="Load More Users"
      />
    </>
  );
};
