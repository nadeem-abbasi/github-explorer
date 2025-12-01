import type { FC } from 'react';
import type { Repository } from '../../../api/types';
import { StarIcon } from '../../../icons';
import styles from './UserAccordion.module.css';

export type RepositoryListProps = {
  repositories: Repository[];
};

export const RepositoryList: FC<RepositoryListProps> = ({ repositories }) => {
  return (
    <ul className={styles.repositoryList}>
      {repositories.map((repo) => (
        <li key={repo.id} className={styles.repositoryItem}>
          <div className={styles.repositoryHeader}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.repositoryLink}
              aria-label={`View ${repo.name} on GitHub`}
            >
              <h3 className={styles.repositoryName}>{repo.name}</h3>
            </a>
            <div className={styles.repositoryStars}>
              <StarIcon className={styles.starIcon} />
              <span>{repo.stargazers_count}</span>
            </div>
          </div>
          {repo.description && (
            <p className={styles.repositoryDescription}>{repo.description}</p>
          )}
        </li>
      ))}
    </ul>
  );
};
