import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('should render title and content when expanded', () => {
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

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should not render content when collapsed', () => {
    render(
      <Accordion
        title="Test Title"
        isExpanded={false}
        onToggle={jest.fn()}
        contentId="test-content"
      >
        <div>Test Content</div>
      </Accordion>,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('should call onToggle when clicked', async () => {
    const user = userEvent.setup();
    const handleToggle = jest.fn();

    render(
      <Accordion
        title="Test Title"
        isExpanded={false}
        onToggle={handleToggle}
        contentId="test-content"
      >
        <div>Test Content</div>
      </Accordion>,
    );

    await user.click(screen.getByText('Test Title'));
    expect(handleToggle).toHaveBeenCalledTimes(1);
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
    expect(button).toHaveAttribute('id', 'test-header');

    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('id', 'test-content');
    expect(region).toHaveAttribute('aria-labelledby', 'test-header');
  });
});
