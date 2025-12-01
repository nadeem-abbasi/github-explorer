import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('should render input and button', () => {
    render(<SearchBar onSearch={jest.fn()} />);

    expect(
      screen.getByPlaceholderText('Search GitHub users...'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('should call onSearch with trimmed query when form is submitted', async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();

    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText('Search GitHub users...');
    await user.type(input, '  testuser  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(handleSearch).toHaveBeenCalledWith('testuser');
  });

  it('should show error when query is less than 3 characters', async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();

    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText('Search GitHub users...');
    await user.type(input, 'ab');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(
      screen.getByText('Please enter at least 3 characters'),
    ).toBeInTheDocument();
    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('should not call onSearch when query is empty', async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();

    render(<SearchBar onSearch={handleSearch} />);

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(
      screen.getByText('Please enter at least 3 characters'),
    ).toBeInTheDocument();
    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('should clear error when user types 3 or more characters', async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();

    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText('Search GitHub users...');

    // Trigger error
    await user.type(input, 'ab');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(
      screen.getByText('Please enter at least 3 characters'),
    ).toBeInTheDocument();

    // Type more characters
    await user.type(input, 'c');

    expect(
      screen.queryByText('Please enter at least 3 characters'),
    ).not.toBeInTheDocument();
  });

  it('should disable input and button when loading', () => {
    render(<SearchBar onSearch={jest.fn()} isLoading={true} />);

    const input = screen.getByPlaceholderText('Search GitHub users...');
    const button = screen.getByRole('button', { name: 'Search' });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('should submit form when Enter key is pressed in input', async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();

    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText('Search GitHub users...');
    await user.type(input, 'testuser{Enter}');

    expect(handleSearch).toHaveBeenCalledWith('testuser');
  });

  it('should have proper ARIA attributes', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={jest.fn()} />);

    const input = screen.getByPlaceholderText('Search GitHub users...');

    expect(input).toHaveAttribute('aria-label', 'Search GitHub users');
    expect(input).toHaveAttribute('aria-invalid', 'false');

    // Trigger error
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'search-error');
  });

  it('should update input value when typing', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={jest.fn()} />);

    const input = screen.getByPlaceholderText(
      'Search GitHub users...',
    ) as HTMLInputElement;
    await user.type(input, 'test');

    expect(input.value).toBe('test');
  });
});
