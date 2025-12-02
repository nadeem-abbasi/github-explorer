import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { User } from '../../../api/types';
import { SearchResults } from './SearchResults';

// Mock the child components
jest.mock('../UserAccordion/UserAccordion', () => ({
  UserAccordion: ({ user, isExpanded, onToggle }: any) => (
    <div data-testid={`user-accordion-${user.id}`}>
      <button onClick={onToggle}>{user.login}</button>
      {isExpanded && <div>Expanded</div>}
    </div>
  ),
}));

jest.mock('../../ui/LoadMoreButton/LoadMoreButton', () => ({
  LoadMoreButton: ({ hasNextPage, onLoadMore, isFetchingNextPage }: any) =>
    hasNextPage ? (
      <button onClick={onLoadMore} disabled={isFetchingNextPage}>
        Load More Users
      </button>
    ) : null,
}));

describe('SearchResults', () => {
  const mockUsers: User[] = [
    {
      id: 1,
      login: 'user1',
      url: 'https://api.github.com/users/user1',
    },
    {
      id: 2,
      login: 'user2',
      url: 'https://api.github.com/users/user2',
    },
  ];

  const defaultProps = {
    users: mockUsers,
    displayedCount: 2,
    expandedUserId: null,
    onToggle: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    onLoadMore: jest.fn(),
    onShowMore: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search results header', () => {
    render(<SearchResults {...defaultProps} />);
    expect(screen.getByText('Search Results')).toBeInTheDocument();
  });

  it('should render all users', () => {
    render(<SearchResults {...defaultProps} />);
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });

  it('should render load more button when hasNextPage is true', () => {
    render(<SearchResults {...defaultProps} hasNextPage={true} />);
    expect(screen.getByText('Load More Users')).toBeInTheDocument();
  });

  it('should not render load more button when hasNextPage is false', () => {
    render(<SearchResults {...defaultProps} hasNextPage={false} />);
    expect(screen.queryByText('Load More Users')).not.toBeInTheDocument();
  });

  it('should call onToggle when user accordion is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchResults {...defaultProps} />);

    await user.click(screen.getByText('user1'));

    expect(defaultProps.onToggle).toHaveBeenCalledWith(1);
  });

  it('should call onLoadMore when load more button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchResults {...defaultProps} hasNextPage={true} />);

    await user.click(screen.getByText('Load More Users'));

    expect(defaultProps.onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should show expanded state for the selected user', () => {
    render(<SearchResults {...defaultProps} expandedUserId={1} />);
    expect(screen.getByText('Expanded')).toBeInTheDocument();
  });

  it('should render empty list correctly', () => {
    render(<SearchResults {...defaultProps} users={[]} />);
    expect(screen.getByText('Search Results')).toBeInTheDocument();
    expect(screen.queryByText('user1')).not.toBeInTheDocument();
  });
});
