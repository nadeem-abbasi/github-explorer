import { type FC, useState } from 'react';
import type { Repository } from '../../../api/types';
import { StarIcon } from '../../../icons';
import styles from './UserAccordion.module.css';

export type RepositoryListProps = {
  repositories: Repository[];
};

const MAX_REPO_NAME_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 100;

const truncateRepoName = (name: string): string => {
  if (name.length <= MAX_REPO_NAME_LENGTH) {
    return name;
  }
  return `${name.slice(0, MAX_REPO_NAME_LENGTH)}...`;
};

const RepositoryDescription: FC<{ description: string }> = ({
  description,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsTruncation = description.length > MAX_DESCRIPTION_LENGTH;
  const displayDescription =
    needsTruncation && !isExpanded
      ? description.slice(0, MAX_DESCRIPTION_LENGTH)
      : description;

  return (
    <div>
      <p className={styles.repositoryDescription}>
        {displayDescription}
        {needsTruncation && !isExpanded && '... '}
        {needsTruncation && !isExpanded && (
          <button
            className={styles.loadMoreButton}
            onClick={() => setIsExpanded(true)}
            type="button"
          >
            Read more
          </button>
        )}
      </p>
    </div>
  );
};

export const RepositoryList: FC<RepositoryListProps> = ({ repositories }) => {
  return (
    <ul className={styles.repositoryList}>
      {repositories.map((repo) => {
        const displayName = truncateRepoName(repo.name);
        const shouldShowTooltip = repo.name.length > MAX_REPO_NAME_LENGTH;

        return (
          <li key={repo.id} className={styles.repositoryItem}>
            <div className={styles.repositoryHeader}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.repositoryLink}
                aria-label={`View ${repo.name} on GitHub`}
              >
                <h3
                  className={styles.repositoryName}
                  title={shouldShowTooltip ? repo.name : undefined}
                >
                  {displayName}
                </h3>
              </a>
              <div className={styles.repositoryStars}>
                <StarIcon className={styles.starIcon} />
                <span>{repo.stargazers_count}</span>
              </div>
            </div>
            {repo.description && (
              <RepositoryDescription description={repo.description} />
            )}
          </li>
        );
      })}
    </ul>
  );
};
