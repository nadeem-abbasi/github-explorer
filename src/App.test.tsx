// Mock the config module to prevent import.meta.env errors in Jest
jest.mock('./api/config', () => ({
  GITHUB_API_BASE: 'https://api.github.com',
  DEFAULT_PER_PAGE_USERS: 30,
  DEFAULT_PER_PAGE_REPOS: 5,
  REQUEST_TIMEOUT: 10000,
  getGitHubToken: jest.fn(() => 'mock-token'),
  createHeaders: jest.fn(() => ({
    Accept: 'application/vnd.github.v3+json',
    Authorization: 'Bearer mock-token',
  })),
}));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, it } from 'node:test';
import App from './App';
import { useDebounce } from './hooks/useDebounce';
import { useSearchUsers } from './hooks/useSearchUsers';

// Mock the hooks and components
jest.mock('./hooks/useSearchUsers');
jest.mock('./hooks/useDebounce');
jest.mock('./components/features/UserAccordion/UserAccordion', () => ({
  UserAccordion: ({ user, isExpanded, onToggle }: any) => (
    <button
      data-testid={`user-accordion-${user.id}`}
      onClick={onToggle}
      aria-expanded={isExpanded}
    >
      {user.login}
    </button>
  ),
}));

const mockUseSearchUsers = useSearchUsers as jest.MockedFunction<
  typeof useSearchUsers
>;
const mockUseDebounce = useDebounce as jest.MockedFunction<typeof useDebounce>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('App', () => {
  beforeEach(() => {
    // Default mock implementations
    mockUseDebounce.mockImplementation((value) => value);
    mockUseSearchUsers.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the header and search bar', () => {
    render(<App />, { wrapper: createWrapper() });

    expect(screen.getByText('GitHub User Explorer')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Search for GitHub users and explore their repositories',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search GitHub users...'),
    ).toBeInTheDocument();
  });

  it('should show empty state initially', () => {
    render(<App />, { wrapper: createWrapper() });

    expect(
      screen.getByText('Start by searching for GitHub users'),
    ).toBeInTheDocument();
  });

  it('should show loading state when searching', () => {
    mockUseSearchUsers.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<App />, { wrapper: createWrapper() });

    const loaders = screen.getAllByLabelText('Loading...');
    expect(loaders.length).toBeGreaterThan(0);
  });

  it('should show error state when search fails', () => {
    mockUseSearchUsers.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('API rate limit exceeded'),
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<App />, { wrapper: createWrapper() });

    expect(screen.getByText('API rate limit exceeded')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should show no results message when search returns empty', async () => {
    const user = userEvent.setup();

    // Start with empty state
    const { rerender } = render(<App />, { wrapper: createWrapper() });

    // User types in search
    const input = screen.getByPlaceholderText('Search GitHub users...');
    await user.type(input, 'nonexistentuser123456');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    // Mock returns empty results
    mockUseDebounce.mockReturnValue('nonexistentuser123456');
    mockUseSearchUsers.mockReturnValue({
      data: {
        pages: [{ total_count: 0, incomplete_results: false, items: [] }],
      },
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    rerender(<App />);

    await waitFor(() => {
      expect(
        screen.getByText('No users found matching your search'),
      ).toBeInTheDocument();
    });
  });

  it('should display user list when results are returned', () => {
    const mockUsers = [
      { id: 1, login: 'user1', url: 'https://api.github.com/users/user1' },
      { id: 2, login: 'user2', url: 'https://api.github.com/users/user2' },
    ];

    mockUseSearchUsers.mockReturnValue({
      data: {
        pages: [
          { total_count: 2, incomplete_results: false, items: mockUsers },
        ],
      },
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<App />, { wrapper: createWrapper() });

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });

  it('should show load more button when there are more pages', () => {
    const mockUsers = [
      { id: 1, login: 'user1', url: 'https://api.github.com/users/user1' },
    ];

    mockUseSearchUsers.mockReturnValue({
      data: {
        pages: [
          { total_count: 100, incomplete_results: false, items: mockUsers },
        ],
      },
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
    } as any);

    render(<App />, { wrapper: createWrapper() });

    expect(screen.getByText('Load More Users')).toBeInTheDocument();
  });

  it('should call fetchNextPage when load more is clicked', async () => {
    const user = userEvent.setup();
    const fetchNextPage = jest.fn();

    const mockUsers = [
      { id: 1, login: 'user1', url: 'https://api.github.com/users/user1' },
    ];

    mockUseSearchUsers.mockReturnValue({
      data: {
        pages: [
          { total_count: 100, incomplete_results: false, items: mockUsers },
        ],
      },
      isLoading: false,
      error: null,
      fetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    } as any);

    render(<App />, { wrapper: createWrapper() });

    await user.click(screen.getByText('Load More Users'));

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('should only allow one accordion to be open at a time', async () => {
    const user = userEvent.setup();

    const mockUsers = [
      { id: 1, login: 'user1', url: 'https://api.github.com/users/user1' },
      { id: 2, login: 'user2', url: 'https://api.github.com/users/user2' },
    ];

    mockUseSearchUsers.mockReturnValue({
      data: {
        pages: [
          { total_count: 2, incomplete_results: false, items: mockUsers },
        ],
      },
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<App />, { wrapper: createWrapper() });

    const user1Button = screen.getByText('user1');
    const user2Button = screen.getByText('user2');

    // Click first user
    await user.click(user1Button);
    expect(user1Button.closest('button')).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    // Click second user
    await user.click(user2Button);
    expect(user2Button.closest('button')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(user1Button.closest('button')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('should close accordion when clicking the same user', async () => {
    const user = userEvent.setup();

    const mockUsers = [
      { id: 1, login: 'user1', url: 'https://api.github.com/users/user1' },
    ];

    mockUseSearchUsers.mockReturnValue({
      data: {
        pages: [
          { total_count: 1, incomplete_results: false, items: mockUsers },
        ],
      },
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<App />, { wrapper: createWrapper() });

    const userButton = screen.getByText('user1');

    // Open accordion
    await user.click(userButton);
    expect(userButton.closest('button')).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    // Close accordion
    await user.click(userButton);
    expect(userButton.closest('button')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('should reset error state when retry is clicked', async () => {
    const user = userEvent.setup();

    mockUseSearchUsers.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'),
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    const { rerender } = render(<App />, { wrapper: createWrapper() });

    expect(screen.getByText('Network error')).toBeInTheDocument();

    // Click retry
    await user.click(screen.getByText('Try Again'));

    // Mock successful state after retry
    mockUseSearchUsers.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    rerender(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Network error')).not.toBeInTheDocument();
      expect(
        screen.getByText('Start by searching for GitHub users'),
      ).toBeInTheDocument();
    });
  });
});
