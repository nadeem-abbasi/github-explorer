import type { Meta, StoryObj } from '@storybook/react';
import { Loader } from './Loader';

const meta: Meta<typeof Loader> = {
  title: 'UI/Loader',
  component: Loader,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the loader',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessibility label',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const WithCustomLabel: Story = {
  args: {
    size: 'medium',
    ariaLabel: 'Fetching data...',
  },
};
