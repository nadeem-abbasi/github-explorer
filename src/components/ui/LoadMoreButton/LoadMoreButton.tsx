import type { FC } from 'react';
import { Button } from '../Button/Button';
import styles from './LoadMoreButton.module.css';

export type LoadMoreButtonProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  label?: string;
};

export const LoadMoreButton: FC<LoadMoreButtonProps> = ({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  label = 'Load More',
}) => {
  if (!hasNextPage) return null;

  return (
    <div className={styles.loadMoreContainer}>
      <Button onClick={onLoadMore} loading={isFetchingNextPage}>
        {label}
      </Button>
    </div>
  );
};
