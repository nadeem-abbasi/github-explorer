import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { User } from '../../../api/types';
import { SearchResults } from './SearchResults';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof SearchResults> = {
  title: 'Features/SearchResults',
  component: SearchResults,
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
type Story = StoryObj<typeof SearchResults>;

const mockUsers: User[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  login: `user${i + 1}`,
  avatar_url: `https://avatars.githubusercontent.com/u/${i + 1}?v=4`,
  html_url: `https://github.com/user${i + 1}`,
}));

export const Default: Story = {
  args: {
    users: mockUsers.slice(0, 5),
    displayedCount: 5,
    expandedUserId: null,
    onToggle: (userId: number) => console.log('Toggle user:', userId),
    hasNextPage: true,
    isFetchingNextPage: false,
    onLoadMore: () => console.log('Load more from API'),
    onShowMore: () => console.log('Show more local results'),
  },
};

export const WithExpandedUser: Story = {
  args: {
    users: mockUsers.slice(0, 5),
    displayedCount: 5,
    expandedUserId: 2,
    onToggle: (userId: number) => console.log('Toggle user:', userId),
    hasNextPage: true,
    isFetchingNextPage: false,
    onLoadMore: () => console.log('Load more from API'),
    onShowMore: () => console.log('Show more local results'),
  },
};

export const WithMoreLocalResults: Story = {
  args: {
    users: mockUsers,
    displayedCount: 5,
    expandedUserId: null,
    onToggle: (userId: number) => console.log('Toggle user:', userId),
    hasNextPage: true,
    isFetchingNextPage: false,
    onLoadMore: () => console.log('Load more from API'),
    onShowMore: () => console.log('Show more local results'),
  },
};

export const AllResultsDisplayed: Story = {
  args: {
    users: mockUsers.slice(0, 5),
    displayedCount: 5,
    expandedUserId: null,
    onToggle: (userId: number) => console.log('Toggle user:', userId),
    hasNextPage: false,
    isFetchingNextPage: false,
    onLoadMore: () => console.log('Load more from API'),
    onShowMore: () => console.log('Show more local results'),
  },
};

export const LoadingMore: Story = {
  args: {
    users: mockUsers.slice(0, 5),
    displayedCount: 5,
    expandedUserId: null,
    onToggle: (userId: number) => console.log('Toggle user:', userId),
    hasNextPage: true,
    isFetchingNextPage: true,
    onLoadMore: () => console.log('Load more from API'),
    onShowMore: () => console.log('Show more local results'),
  },
};

export const SingleUser: Story = {
  args: {
    users: mockUsers.slice(0, 1),
    displayedCount: 1,
    expandedUserId: null,
    onToggle: (userId: number) => console.log('Toggle user:', userId),
    hasNextPage: false,
    isFetchingNextPage: false,
    onLoadMore: () => console.log('Load more from API'),
    onShowMore: () => console.log('Show more local results'),
  },
};
