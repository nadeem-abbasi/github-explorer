import classNames from 'classnames';
import type { ButtonHTMLAttributes, FC } from 'react';
import { Loader } from '../Loader/Loader';
import styles from './Button.module.css';

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> & {
  children: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  type = 'button',
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={classNames(styles.button, styles[variant], {
        [styles.loading]: loading,
      })}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <span className={styles.loaderWrapper} aria-hidden="true">
          <Loader size="small" />
        </span>
      )}
      <span className={classNames({ [styles.hiddenText]: loading })}>
        {children}
      </span>
    </button>
  );
};
