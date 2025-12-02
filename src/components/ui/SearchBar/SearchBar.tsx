import { type FC, useState } from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import styles from './SearchBar.module.css';

export type SearchBarProps = {
  onSearch: (query: string) => void;
  isLoading?: boolean;
};

export const SearchBar: FC<SearchBarProps> = ({
  onSearch,
  isLoading = false,
}) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim().length < 3) {
      setError('Please enter at least 3 characters');
      return;
    }

    setError('');
    onSearch(query.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (error && e.target.value.trim().length >= 3) {
      setError('');
    }
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <label htmlFor="github-search" className={styles.label}>
        Search Users
      </label>
      <div className={styles.inputWrapper}>
        <Input
          id="github-search"
          value={query}
          onChange={handleChange}
          placeholder="Search GitHub users..."
          disabled={isLoading}
          aria-label="Search GitHub users"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'search-error' : undefined}
        />
        <Button type="submit" loading={isLoading}>
          Search
        </Button>
        {error && (
          <span id="search-error" className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    </form>
  );
};
