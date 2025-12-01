import { type FC } from 'react';
import { ErrorIcon } from '../../../icons';
import { Button } from '../Button/Button';
import styles from './Error.module.css';

export type ErrorProps = {
  message: string;
  onRetry?: () => void;
};

export const Error: FC<ErrorProps> = ({ message, onRetry }) => {
  return (
    <div className={styles.errorContainer} role="alert">
      <ErrorIcon className={styles.errorIcon} />
      <div className={styles.errorContent}>
        <p className={styles.errorMessage}>{message}</p>
        {onRetry && (
          <Button
            variant="secondary"
            onClick={onRetry}
            aria-label="Retry the operation"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};
