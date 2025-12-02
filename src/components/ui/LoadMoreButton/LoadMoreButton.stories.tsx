import type { Meta, StoryObj } from '@storybook/react';
import { LoadMoreButton } from './LoadMoreButton';

const meta = {
  title: 'UI/LoadMoreButton',
  component: LoadMoreButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onLoadMore: { action: 'load more clicked' },
  },
} satisfies Meta<typeof LoadMoreButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hasNextPage: true,
    isFetchingNextPage: false,
    label: 'Load More',
    onLoadMore: () => {},
  },
};

export const Loading: Story = {
  args: {
    hasNextPage: true,
    isFetchingNextPage: true,
    label: 'Load More',
    onLoadMore: () => {},
  },
};

export const CustomLabel: Story = {
  args: {
    hasNextPage: true,
    isFetchingNextPage: false,
    label: 'Load More Users',
    onLoadMore: () => {},
  },
};

export const NoMorePages: Story = {
  args: {
    hasNextPage: false,
    isFetchingNextPage: false,
    label: 'Load More',
    onLoadMore: () => {},
  },
};
