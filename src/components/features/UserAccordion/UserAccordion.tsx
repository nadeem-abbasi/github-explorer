import type { FC } from 'react';
import type { User } from '../../../api/types';
import { useUserRepositories } from '../../../hooks/useUserRepositories';
import { Accordion } from '../../ui/Accordion/Accordion';
import { Loader } from '../../ui/Loader/Loader';
import { LoadMoreButton } from './LoadMoreButton';
import { RepositoryList } from './RepositoryList';
import styles from './UserAccordion.module.css';

export type UserAccordionProps = {
  user: User;
  isExpanded: boolean;
  onToggle: () => void;
};

export const UserAccordion: FC<UserAccordionProps> = ({
  user,
  isExpanded,
  onToggle,
}) => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserRepositories(user.login, isExpanded);

  const allRepositories =
    data?.pages.flatMap((page) => page.repositories) ?? [];

  const hasRepositories = allRepositories.length > 0;
  const showEmptyState = !isLoading && !error && !hasRepositories;

  return (
    <Accordion
      title={user.login}
      isExpanded={isExpanded}
      onToggle={onToggle}
      contentId={`accordion-content-${user.id}`}
      headerId={`accordion-header-${user.id}`}
    >
      {isLoading && <Loader size="small" />}

      {error && (
        <p className={styles.error} role="alert">
          Failed to load repositories. Please try again later.
        </p>
      )}

      {showEmptyState && <p className={styles.empty}>No repositories found</p>}

      {hasRepositories && <RepositoryList repositories={allRepositories} />}

      {hasNextPage && (
        <LoadMoreButton
          onLoadMore={fetchNextPage}
          isLoading={isFetchingNextPage}
        />
      )}
    </Accordion>
  );
};
