import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const validDelay = delay <= 0 ? 500 : delay;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, validDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, validDelay]);

  return debouncedValue;
};
