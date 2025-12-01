import type { FC } from 'react';
import { Button } from '../../ui/Button/Button';
import styles from './UserAccordion.module.css';

export type LoadMoreButtonProps = {
  onLoadMore: () => void;
  isLoading: boolean;
};

export const LoadMoreButton: FC<LoadMoreButtonProps> = ({
  onLoadMore,
  isLoading,
}) => {
  return (
    <div className={styles.loadMoreContainer}>
      <Button
        variant="secondary"
        onClick={onLoadMore}
        loading={isLoading}
        aria-label="Load more repositories"
        aria-busy={isLoading}
      >
        Load More
      </Button>
    </div>
  );
};
