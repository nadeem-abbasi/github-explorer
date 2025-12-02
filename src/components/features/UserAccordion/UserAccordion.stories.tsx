import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { User } from '../../../api/types';
import { UserAccordion } from './UserAccordion';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof UserAccordion> = {
  title: 'Features/UserAccordion',
  component: UserAccordion,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserAccordion>;

const mockUser: User = {
  id: 1,
  login: 'octocat',
  avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
  html_url: 'https://github.com/octocat',
};

const anotherUser: User = {
  id: 2,
  login: 'torvalds',
  avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
  html_url: 'https://github.com/torvalds',
};

export const Collapsed: Story = {
  args: {
    user: mockUser,
    isExpanded: false,
    onToggle: () => console.log('Toggle accordion'),
  },
};

export const Expanded: Story = {
  args: {
    user: mockUser,
    isExpanded: true,
    onToggle: () => console.log('Toggle accordion'),
  },
};

export const AnotherUserCollapsed: Story = {
  args: {
    user: anotherUser,
    isExpanded: false,
    onToggle: () => console.log('Toggle accordion'),
  },
};

export const AnotherUserExpanded: Story = {
  args: {
    user: anotherUser,
    isExpanded: true,
    onToggle: () => console.log('Toggle accordion'),
  },
};

export const MultipleUsers: Story = {
  render: () => {
    const users = [mockUser, anotherUser];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {users.map((user) => (
          <UserAccordion
            key={user.id}
            user={user}
            isExpanded={user.id === 1}
            onToggle={() => console.log('Toggle user:', user.login)}
          />
        ))}
      </div>
    );
  },
};
