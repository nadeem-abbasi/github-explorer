import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { User } from '../../../api/types';
import { SearchContent } from './SearchContent';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof SearchContent> = {
  title: 'Features/SearchContent',
  component: SearchContent,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchContent>;

const mockUsers: User[] = [
  {
    id: 1,
    login: 'octocat',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    html_url: 'https://github.com/octocat',
  },
  {
    id: 2,
    login: 'torvalds',
    avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    html_url: 'https://github.com/torvalds',
  },
  {
    id: 3,
    login: 'gaearon',
    avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4',
    html_url: 'https://github.com/gaearon',
  },
];

export const EmptyState: Story = {
  args: {
    searchQuery: '',
    debouncedQuery: '',
    isLoading: false,
    error: null,
    users: [],
    displayedCount: 0,
    expandedUserId: null,
    onToggle: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
    onLoadMore: () => {},
    onShowMore: () => {},
    onRetry: () => {},
  },
};

export const Loading: Story = {
  args: {
    searchQuery: 'octocat',
    debouncedQuery: 'octocat',
    isLoading: true,
    error: null,
    users: [],
    displayedCount: 0,
    expandedUserId: null,
    onToggle: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
    onLoadMore: () => {},
    onShowMore: () => {},
    onRetry: () => {},
  },
};

export const Debouncing: Story = {
  args: {
    searchQuery: 'octocats',
    debouncedQuery: 'octocat',
    isLoading: false,
    error: null,
    users: mockUsers,
    displayedCount: 3,
    expandedUserId: null,
    onToggle: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
    onLoadMore: () => {},
    onShowMore: () => {},
    onRetry: () => {},
  },
};

export const WithResults: Story = {
  args: {
    searchQuery: 'octocat',
    debouncedQuery: 'octocat',
    isLoading: false,
    error: null,
    users: mockUsers,
    displayedCount: 3,
    expandedUserId: null,
    onToggle: (userId: number) => console.log('Toggle user:', userId),
    hasNextPage: true,
    isFetchingNextPage: false,
    onLoadMore: () => console.log('Load more'),
    onShowMore: () => console.log('Show more'),
    onRetry: () => {},
  },
};

export const WithError: Story = {
  args: {
    searchQuery: 'octocat',
    debouncedQuery: 'octocat',
    isLoading: false,
    error: new Error('API rate limit exceeded'),
    users: [],
    displayedCount: 0,
    expandedUserId: null,
    onToggle: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
    onLoadMore: () => {},
    onShowMore: () => {},
    onRetry: () => console.log('Retry'),
  },
};

export const WithExpandedUser: Story = {
  args: {
    searchQuery: 'octocat',
    debouncedQuery: 'octocat',
    isLoading: false,
    error: null,
    users: mockUsers,
    displayedCount: 3,
    expandedUserId: 1,
    onToggle: (userId: number) => console.log('Toggle user:', userId),
    hasNextPage: false,
    isFetchingNextPage: false,
    onLoadMore: () => {},
    onShowMore: () => {},
    onRetry: () => {},
  },
};
