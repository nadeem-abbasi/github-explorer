import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Current input value',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessibility label',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    value: '',
    onChange: () => {},
    ariaLabel: 'Default input',
  },
};

export const WithPlaceholder: Story = {
  args: {
    value: '',
    onChange: () => {},
    placeholder: 'Enter your search query...',
    ariaLabel: 'Search input',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Example value',
    onChange: () => {},
    ariaLabel: 'Input with value',
  },
};

export const Disabled: Story = {
  args: {
    value: 'Disabled input',
    onChange: () => {},
    disabled: true,
    ariaLabel: 'Disabled input',
  },
};
