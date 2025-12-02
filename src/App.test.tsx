// Mock the config module to prevent import.meta.env errors in Jest
jest.mock('./api/config', () => ({
  GITHUB_API_BASE: 'https://api.github.com',
  DEFAULT_PER_PAGE_USERS: 30,
  DEFAULT_PER_PAGE_REPOS: 5,
  MAX_DISPLAYED_USERS: 5,
  REQUEST_TIMEOUT: 10000,
  getGitHubToken: jest.fn(() => 'mock-token'),
  createHeaders: jest.fn(() => ({
    Accept: 'application/vnd.github.v3+json',
    Authorization: 'Bearer mock-token',
  })),
}));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { useDebounce } from './hooks/useDebounce';
import { useSearchUsers } from './hooks/useSearchUsers';

// Mock the hooks
jest.mock('./hooks/useSearchUsers');
jest.mock('./hooks/useDebounce');

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

  it('should render the app with header and search bar', () => {
    render(<App />, { wrapper: createWrapper() });

    expect(screen.getByText('GitHub User Explorer')).toBeInTheDocument();
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

  it('should display users when search returns results', async () => {
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

    // Simulate user typing in search
    const searchInput = screen.getByPlaceholderText('Search GitHub users...');
    await user.type(searchInput, 'test');

    // Submit the search
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });

  it('should show error state and allow retry', async () => {
    const user = userEvent.setup();

    mockUseSearchUsers.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('API rate limit exceeded'),
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<App />, { wrapper: createWrapper() });

    // Simulate user typing in search to trigger the error state
    const searchInput = screen.getByPlaceholderText('Search GitHub users...');
    await user.type(searchInput, 'test');

    // Submit the search
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    expect(screen.getByText(/API rate limit exceeded/i)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', {
      name: /retry the operation/i,
    });
    await user.click(retryButton);

    // Verify retry shows the placeholder again (search was cleared)
    expect(
      screen.getByText('Start by searching for GitHub users'),
    ).toBeInTheDocument();
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

    // Simulate user typing in search
    const searchInput = screen.getByPlaceholderText('Search GitHub users...');
    await user.type(searchInput, 'test');

    // Submit the search
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    const loadMoreButton = screen.getByRole('button', {
      name: /load more users/i,
    });
    await user.click(loadMoreButton);

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });
});
