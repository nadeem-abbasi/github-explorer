import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContent}>
            <h1 className={styles.errorTitle}>Oops! Something went wrong</h1>
            <p className={styles.errorMessage}>
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>
            {this.state.error && (
              <details className={styles.errorDetails}>
                <summary>Error details</summary>
                <pre className={styles.errorStack}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className={styles.errorActions}>
              <button
                onClick={this.handleReset}
                className={styles.resetButton}
                type="button"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className={styles.reloadButton}
                type="button"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
