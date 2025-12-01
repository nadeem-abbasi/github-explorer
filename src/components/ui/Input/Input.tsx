import { type FC, type InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const Input: FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  ...rest
}: InputProps) => {
  return (
    <input
      type="text"
      className={styles.input}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      {...rest}
    />
  );
};
