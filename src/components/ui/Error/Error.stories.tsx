import type { Meta, StoryObj } from '@storybook/react';
import { Error } from './Error';

const meta: Meta<typeof Error> = {
  title: 'Components/Error',
  component: Error,
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'Error message to display',
    },
    onRetry: {
      action: 'retry',
      description: 'Retry handler',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Error>;

export const WithoutRetry: Story = {
  args: {
    message: 'An error occurred while fetching data.',
  },
};

export const WithRetry: Story = {
  args: {
    message: 'Failed to load repositories. Please try again.',
    onRetry: () => alert('Retrying...'),
  },
};

export const RateLimitError: Story = {
  args: {
    message: 'API rate limit exceeded. Please try again later.',
    onRetry: () => alert('Retrying...'),
  },
};

export const NetworkError: Story = {
  args: {
    message:
      'Network error. Please check your internet connection and try again.',
    onRetry: () => alert('Retrying...'),
  },
};
