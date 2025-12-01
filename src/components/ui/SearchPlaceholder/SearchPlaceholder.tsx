import { type FC } from 'react';
import { SearchIcon } from '../../../icons';
import styles from './SearchPlaceholder.module.css';

export type SearchPlaceholderProps = {
  message: string;
};

export const SearchPlaceholder: FC<SearchPlaceholderProps> = ({ message }) => {
  return (
    <div className={styles.searchPlaceholder} role="status" aria-live="polite">
      <SearchIcon className={styles.icon} />
      <p className={styles.message}>{message}</p>
    </div>
  );
};
