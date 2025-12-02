import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('should render title and toggle content', async () => {
    const user = userEvent.setup();
    const handleToggle = jest.fn();

    const { rerender } = render(
      <Accordion
        title="Test Title"
        isExpanded={false}
        onToggle={handleToggle}
        contentId="test-content"
      >
        <div>Test Content</div>
      </Accordion>,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();

    await user.click(screen.getByText('Test Title'));
    expect(handleToggle).toHaveBeenCalledTimes(1);

    // Rerender with expanded state
    rerender(
      <Accordion
        title="Test Title"
        isExpanded={true}
        onToggle={handleToggle}
        contentId="test-content"
      >
        <div>Test Content</div>
      </Accordion>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should have correct aria attributes', () => {
    render(
      <Accordion
        title="Test Title"
        isExpanded={true}
        onToggle={jest.fn()}
        contentId="test-content"
        headerId="test-header"
      >
        <div>Test Content</div>
      </Accordion>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-controls', 'test-content');

    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-labelledby', 'test-header');
  });
});
