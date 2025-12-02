import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('should render with children', () => {
    render(<Button aria-label="Test button">Click me</Button>);

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button onClick={handleClick} aria-label="Test button">
        Click me
      </Button>,
    );

    await user.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button onClick={handleClick} disabled={true} aria-label="Test button">
        Click me
      </Button>,
    );

    await user.click(screen.getByText('Click me'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should show loading state', () => {
    render(
      <Button loading={true} aria-label="Loading button">
        Click me
      </Button>,
    );

    const button = screen.getByLabelText('Loading button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when loading', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button onClick={handleClick} loading={true} aria-label="Loading button">
        Click me
      </Button>,
    );

    await user.click(screen.getByText('Click me'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    render(<Button aria-label="Accessible button">Click me</Button>);

    const button = screen.getByLabelText('Accessible button');
    expect(button).toHaveAttribute('aria-label', 'Accessible button');
  });

  it('should render with submit type', () => {
    render(
      <Button type="submit" aria-label="Submit button">
        Submit
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Submit button' });
    expect(button).toHaveAttribute('type', 'submit');
  });
});
