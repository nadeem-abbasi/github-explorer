import { render, screen } from '@testing-library/react';
import type { Repository } from '../../../api/types';
import { RepositoryList } from './RepositoryList';

const mockRepositories: Repository[] = [
  {
    id: 1,
    name: 'test-repo-1',
    description: 'A test repository',
    stargazers_count: 42,
    html_url: 'https://github.com/user/test-repo-1',
  },
  {
    id: 2,
    name: 'test-repo-2',
    description: null,
    stargazers_count: 0,
    html_url: 'https://github.com/user/test-repo-2',
  },
];

describe('RepositoryList', () => {
  it('should render list of repositories', () => {
    render(<RepositoryList repositories={mockRepositories} />);

    expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    expect(screen.getByText('A test repository')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();

    expect(screen.getByText('test-repo-2')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render repository links with correct attributes', () => {
    render(<RepositoryList repositories={mockRepositories} />);

    const link1 = screen.getByLabelText('View test-repo-1 on GitHub');
    expect(link1).toHaveAttribute(
      'href',
      'https://github.com/user/test-repo-1',
    );
    expect(link1).toHaveAttribute('target', '_blank');
    expect(link1).toHaveAttribute('rel', 'noopener noreferrer');

    const link2 = screen.getByLabelText('View test-repo-2 on GitHub');
    expect(link2).toHaveAttribute(
      'href',
      'https://github.com/user/test-repo-2',
    );
  });

  it('should not render description if it is null', () => {
    render(<RepositoryList repositories={mockRepositories} />);

    expect(screen.queryByText('A test repository')).toBeInTheDocument();
    expect(screen.queryByText('null')).not.toBeInTheDocument();
  });

  it('should render star count for each repository', () => {
    render(<RepositoryList repositories={mockRepositories} />);

    const starCounts = screen.getAllByText(/^\d+$/);
    expect(starCounts).toHaveLength(2);
    expect(starCounts[0]).toHaveTextContent('42');
    expect(starCounts[1]).toHaveTextContent('0');
  });

  it('should render empty list when no repositories are provided', () => {
    const { container } = render(<RepositoryList repositories={[]} />);

    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(list?.children.length).toBe(0);
  });

  it('should render each repository as a list item', () => {
    render(<RepositoryList repositories={mockRepositories} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
  });
});
