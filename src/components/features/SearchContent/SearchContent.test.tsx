import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { User } from '../../../api/types';
import { SearchContent } from './SearchContent';

// Mock child components
jest.mock('../../ui/SearchPlaceholder/SearchPlaceholder', () => ({
  SearchPlaceholder: ({ message }: any) => <div>{message}</div>,
}));

jest.mock('../../ui/Error/Error', () => ({
  Error: ({ message, onRetry }: any) => (
    <div>
      <div>{message}</div>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

jest.mock('../../ui/Loader/Loader', () => ({
  Loader: () => <div>Loading...</div>,
}));

jest.mock('../SearchResults/SearchResults', () => ({
  SearchResults: ({ users, onLoadMore }: any) => (
    <div>
      <div data-testid="search-results">
        {users.map((user: User) => (
          <div key={user.id}>{user.login}</div>
        ))}
      </div>
      <button onClick={onLoadMore}>Load More</button>
    </div>
  ),
}));

describe('SearchContent', () => {
  const mockUsers: User[] = [
    {
      id: 1,
      login: 'user1',
      url: 'https://api.github.com/users/user1',
    },
  ];

  const defaultProps = {
    searchQuery: '',
    debouncedQuery: '',
    isLoading: false,
    error: null,
    users: [],
    displayedCount: 5,
    expandedUserId: null,
    onToggle: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    onLoadMore: jest.fn(),
    onShowMore: jest.fn(),
    onRetry: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show empty state when no search query', () => {
    render(<SearchContent {...defaultProps} />);
    expect(
      screen.getByText('Start by searching for GitHub users'),
    ).toBeInTheDocument();
  });

  it('should show no results message when search returns no users', () => {
    render(
      <SearchContent
        {...defaultProps}
        searchQuery="test"
        debouncedQuery="test"
        users={[]}
        isLoading={false}
      />,
    );
    expect(
      screen.getByText('No users found matching your search'),
    ).toBeInTheDocument();
  });

  it('should show error message when error occurs', () => {
    const error = new Error('API Error');
    render(
      <SearchContent
        {...defaultProps}
        searchQuery="test"
        debouncedQuery="test"
        error={error}
      />,
    );
    expect(screen.getByText('API Error')).toBeInTheDocument();
  });

  it('should show loader when loading initial data', () => {
    render(
      <SearchContent
        {...defaultProps}
        searchQuery="test"
        debouncedQuery="test"
        isLoading={true}
      />,
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should not show loader when fetching next page', () => {
    render(
      <SearchContent
        {...defaultProps}
        searchQuery="test"
        debouncedQuery="test"
        isLoading={true}
        isFetchingNextPage={true}
        users={mockUsers}
      />,
    );
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should show search results when users are available', () => {
    render(
      <SearchContent
        {...defaultProps}
        searchQuery="test"
        debouncedQuery="test"
        users={mockUsers}
      />,
    );
    expect(screen.getByTestId('search-results')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const error = new Error('API Error');
    render(
      <SearchContent
        {...defaultProps}
        searchQuery="test"
        debouncedQuery="test"
        error={error}
      />,
    );

    await user.click(screen.getByText('Retry'));

    expect(defaultProps.onRetry).toHaveBeenCalledTimes(1);
  });

  it('should call onLoadMore when load more is clicked', async () => {
    const user = userEvent.setup();
    render(
      <SearchContent
        {...defaultProps}
        searchQuery="test"
        debouncedQuery="test"
        users={mockUsers}
      />,
    );

    await user.click(screen.getByText('Load More'));

    expect(defaultProps.onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should show loader when debouncing with valid query', () => {
    render(
      <SearchContent
        {...defaultProps}
        searchQuery="test"
        debouncedQuery="te"
        isLoading={false}
      />,
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
