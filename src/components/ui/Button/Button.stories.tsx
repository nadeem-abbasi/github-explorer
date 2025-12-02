import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Button content',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Button style variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    ariaLabel: 'Primary button',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    ariaLabel: 'Secondary button',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
    ariaLabel: 'Disabled button',
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading Button',
    variant: 'primary',
    loading: true,
    ariaLabel: 'Loading button',
  },
};

export const SecondaryLoading: Story = {
  args: {
    children: 'Loading',
    variant: 'secondary',
    loading: true,
    ariaLabel: 'Loading button',
  },
};
