import { afterEach, describe, it } from 'node:test';
import { debounce } from './debounce';

describe('debounce', () => {
  jest.useFakeTimers();

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should delay function execution', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc('test');
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(499);
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(func).toHaveBeenCalledWith('test');
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous calls', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc('first');
    jest.advanceTimersByTime(200);

    debouncedFunc('second');
    jest.advanceTimersByTime(200);

    debouncedFunc('third');
    jest.advanceTimersByTime(500);

    expect(func).toHaveBeenCalledWith('third');
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should work with multiple arguments', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc('arg1', 'arg2', 'arg3');
    jest.advanceTimersByTime(500);

    expect(func).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
  });

  it('should work with different wait times', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc('test');
    jest.advanceTimersByTime(999);
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(func).toHaveBeenCalled();
  });
});
