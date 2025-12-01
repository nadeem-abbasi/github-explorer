import { type FC } from 'react';
import styles from './Loader.module.css';

export type LoaderProps = {
  size?: 'small' | 'medium' | 'large';
};

export const Loader: FC<LoaderProps> = ({ size = 'medium' }) => {
  return (
    <div
      className={styles.loaderContainer}
      role="status"
      aria-label="Loading..."
    >
      <div className={`${styles.loader} ${styles[size]}`} />
      <span className={styles.visuallyHidden}>Loading...</span>
    </div>
  );
};
