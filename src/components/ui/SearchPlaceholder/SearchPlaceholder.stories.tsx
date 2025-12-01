import type { Meta, StoryObj } from '@storybook/react';
import { SearchPlaceholder } from './SearchPlaceholder';

const meta = {
  title: 'Components/SearchPlaceholder',
  component: SearchPlaceholder,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'Start by searching for GitHub users',
  },
};

export const NoResults: Story = {
  args: {
    message: 'No users found matching your search',
  },
};

export const LongMessage: Story = {
  args: {
    message:
      "We couldn't find any GitHub users matching your search criteria. Try adjusting your search terms.",
  },
};
