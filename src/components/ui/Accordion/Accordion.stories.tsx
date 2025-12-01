import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Accordion } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
      <Accordion
        title="Example Accordion"
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        contentId="accordion-content-1"
        headerId="accordion-header-1"
      >
        <p style={{ margin: 0 }}>
          This is the content inside the accordion. It can contain any React
          elements.
        </p>
      </Accordion>
    );
  },
};

export const WithRichContent: Story = {
  render: () => {
    const [isExpanded, setIsExpanded] = useState(true);
    return (
      <Accordion
        title="Rich Content Accordion"
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        contentId="accordion-content-2"
        headerId="accordion-header-2"
      >
        <div>
          <h3 style={{ marginTop: 0 }}>Title Inside</h3>
          <p>Some paragraph text with more information.</p>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
            <li>List item 3</li>
          </ul>
        </div>
      </Accordion>
    );
  },
};

export const Collapsed: Story = {
  args: {
    title: 'Collapsed Accordion',
    isExpanded: false,
    onToggle: () => {},
    contentId: 'accordion-content-3',
    headerId: 'accordion-header-3',
    children: <p>This content is hidden when collapsed.</p>,
  },
};

export const Expanded: Story = {
  args: {
    title: 'Expanded Accordion',
    isExpanded: true,
    onToggle: () => {},
    contentId: 'accordion-content-4',
    headerId: 'accordion-header-4',
    children: <p>This content is visible when expanded.</p>,
  },
};
