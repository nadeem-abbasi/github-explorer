import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { User } from '../../../api/types';
import { useUserRepositories } from '../../../hooks/useUserRepositories';
import { UserAccordion } from './UserAccordion';

// Mock the entire hooks module to avoid importing config
jest.mock('../../../hooks/useUserRepositories', () => ({
  useUserRepositories: jest.fn(),
}));

const mockUser: User = {
  id: 1,
  login: 'testuser',
  url: 'https://api.github.com/users/testuser',
};

const mockRepositories = [
  {
    id: 101,
    name: 'repo-1',
    description: 'Test repository 1',
    stargazers_count: 42,
    html_url: 'https://github.com/testuser/repo-1',
  },
  {
    id: 102,
    name: 'repo-2',
    description: null,
    stargazers_count: 0,
    html_url: 'https://github.com/testuser/repo-2',
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('UserAccordion', () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render username in accordion header', () => {
    (useUserRepositories as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(
      <UserAccordion
        user={mockUser}
        isExpanded={false}
        onToggle={mockOnToggle}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('should show loader when loading repositories', () => {
    (useUserRepositories as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(
      <UserAccordion
        user={mockUser}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should display error message when repository fetch fails', () => {
    (useUserRepositories as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('API Error'),
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(
      <UserAccordion
        user={mockUser}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
      { wrapper: createWrapper() },
    );

    expect(
      screen.getByText('Failed to load repositories. Please try again later.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should show empty state when user has no repositories', () => {
    (useUserRepositories as jest.Mock).mockReturnValue({
      data: { pages: [{ repositories: [], hasNextPage: false }] },
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(
      <UserAccordion
        user={mockUser}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('No repositories found')).toBeInTheDocument();
  });

  it('should display list of repositories', () => {
    (useUserRepositories as jest.Mock).mockReturnValue({
      data: {
        pages: [{ repositories: mockRepositories, hasNextPage: false }],
      },
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(
      <UserAccordion
        user={mockUser}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('repo-1')).toBeInTheDocument();
    expect(screen.getByText('Test repository 1')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();

    expect(screen.getByText('repo-2')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render repository links with correct href', () => {
    (useUserRepositories as jest.Mock).mockReturnValue({
      data: {
        pages: [{ repositories: mockRepositories, hasNextPage: false }],
      },
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(
      <UserAccordion
        user={mockUser}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
      { wrapper: createWrapper() },
    );

    const link1 = screen.getByLabelText('View repo-1 on GitHub');
    expect(link1).toHaveAttribute('href', 'https://github.com/testuser/repo-1');
    expect(link1).toHaveAttribute('target', '_blank');
    expect(link1).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should show "Load More" button when there are more pages', () => {
    const mockFetchNextPage = jest.fn();

    (useUserRepositories as jest.Mock).mockReturnValue({
      data: {
        pages: [{ repositories: mockRepositories, hasNextPage: true }],
      },
      isLoading: false,
      error: null,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    render(
      <UserAccordion
        user={mockUser}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
      { wrapper: createWrapper() },
    );

    const loadMoreButton = screen.getByRole('button', {
      name: 'Load more repositories',
    });
    expect(loadMoreButton).toBeInTheDocument();
  });

  it('should call fetchNextPage when "Load More" button is clicked', async () => {
    const user = userEvent.setup();
    const mockFetchNextPage = jest.fn();

    (useUserRepositories as jest.Mock).mockReturnValue({
      data: {
        pages: [{ repositories: mockRepositories, hasNextPage: true }],
      },
      isLoading: false,
      error: null,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    render(
      <UserAccordion
        user={mockUser}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
      { wrapper: createWrapper() },
    );

    const loadMoreButton = screen.getByRole('button', {
      name: 'Load more repositories',
    });
    await user.click(loadMoreButton);

    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('should show loading state on "Load More" button while fetching', () => {
    (useUserRepositories as jest.Mock).mockReturnValue({
      data: {
        pages: [{ repositories: mockRepositories, hasNextPage: true }],
      },
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: true,
    });

    render(
      <UserAccordion
        user={mockUser}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
      { wrapper: createWrapper() },
    );

    const loadMoreButton = screen.getByRole('button', {
      name: 'Load more repositories',
    });
    expect(loadMoreButton).toHaveAttribute('aria-busy', 'true');
  });

  it('should not show "Load More" button when there are no more pages', () => {
    (useUserRepositories as jest.Mock).mockReturnValue({
      data: {
        pages: [{ repositories: mockRepositories, hasNextPage: false }],
      },
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(
      <UserAccordion
        user={mockUser}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
      { wrapper: createWrapper() },
    );

    expect(
      screen.queryByRole('button', { name: 'Load more repositories' }),
    ).not.toBeInTheDocument();
  });

  it('should handle multiple pages of repositories', () => {
    const page1Repos = [mockRepositories[0]];
    const page2Repos = [mockRepositories[1]];

    (useUserRepositories as jest.Mock).mockReturnValue({
      data: {
        pages: [
          { repositories: page1Repos, hasNextPage: true },
          { repositories: page2Repos, hasNextPage: false },
        ],
      },
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(
      <UserAccordion
        user={mockUser}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('repo-1')).toBeInTheDocument();
    expect(screen.getByText('repo-2')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    (useUserRepositories as jest.Mock).mockReturnValue({
      data: {
        pages: [{ repositories: mockRepositories, hasNextPage: false }],
      },
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(
      <UserAccordion
        user={mockUser}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
      { wrapper: createWrapper() },
    );

    const accordionButton = screen.getByRole('button', { name: 'testuser' });
    expect(accordionButton).toHaveAttribute('aria-expanded', 'true');
    expect(accordionButton).toHaveAttribute(
      'aria-controls',
      'accordion-content-1',
    );

    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('id', 'accordion-content-1');
    expect(region).toHaveAttribute('aria-labelledby', 'accordion-header-1');
  });
});
