import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ maxWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSearch: (query: string) => console.log('Searching for:', query),
  },
};

export const Loading: Story = {
  args: {
    onSearch: (query: string) => console.log('Searching for:', query),
    isLoading: true,
  },
};

export const WithInitialError: Story = {
  render: () => {
    const handleSearch = (query: string) =>
      console.log('Searching for:', query);
    return <SearchBar onSearch={handleSearch} />;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = canvasElement;
    const button = canvas.querySelector('button');
    if (button) {
      button.click();
    }
  },
};
