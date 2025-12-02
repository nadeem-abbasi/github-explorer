import type { FC } from 'react';
import styles from './Header.module.css';

export const Header: FC = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>GitHub User Explorer</h1>
      <p className={styles.subtitle}>
        Search for GitHub users and explore their repositories
      </p>
    </header>
  );
};
