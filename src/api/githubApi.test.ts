import { getUserRepositories, searchUsers } from './githubApi';
import type { Repository, SearchUsersResponse } from './types';

// Mock config module
jest.mock('./config', () => ({
  GITHUB_API_BASE: 'https://api.github.com',
  DEFAULT_PER_PAGE_USERS: 30,
  DEFAULT_PER_PAGE_REPOS: 5,
  REQUEST_TIMEOUT: 10000,
  getGitHubToken: jest.fn(() => undefined),
  createHeaders: jest.fn(() => ({ Accept: 'application/vnd.github.v3+json' })),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('githubApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchUsers', () => {
    it('should fetch users successfully', async () => {
      const mockResponse: SearchUsersResponse = {
        total_count: 2,
        incomplete_results: false,
        items: [
          { id: 1, login: 'user1', url: 'https://api.github.com/users/user1' },
          { id: 2, login: 'user2', url: 'https://api.github.com/users/user2' },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchUsers('test', 1);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=test&page=1&per_page=30',
        expect.objectContaining({
          headers: { Accept: 'application/vnd.github.v3+json' },
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle rate limit errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        headers: {
          get: (name: string) => {
            if (name === 'X-RateLimit-Remaining') {
              return '0';
            }
            return null;
          },
        },
        json: async () => ({}),
      });

      await expect(searchUsers('test')).rejects.toThrow(
        'API rate limit exceeded. Please try again later or add a GitHub token for higher limits.',
      );
    });

    it('should handle permission errors (403 without rate limit)', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        headers: {
          get: () => null,
        },
        json: async () => ({}),
      });

      await expect(searchUsers('test')).rejects.toThrow(
        'Access forbidden. Please check your GitHub token permissions.',
      );
    });

    it('should handle invalid query errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
      });

      await expect(searchUsers('test')).rejects.toThrow(
        'Invalid search query. Please try a different search term.',
      );
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(searchUsers('test')).rejects.toThrow('Network error');
    });

    it('should trim query string', async () => {
      const mockResponse: SearchUsersResponse = {
        total_count: 1,
        incomplete_results: false,
        items: [
          { id: 1, login: 'user1', url: 'https://api.github.com/users/user1' },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await searchUsers('  test  ');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=test&page=1&per_page=30',
        expect.any(Object),
      );
    });
  });

  describe('getUserRepositories', () => {
    it('should fetch repositories with pagination info', async () => {
      const mockRepos: Repository[] = [
        {
          id: 1,
          name: 'repo1',
          description: 'Test repo 1',
          stargazers_count: 10,
        },
        { id: 2, name: 'repo2', description: null, stargazers_count: 5 },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
        headers: {
          get: (name: string) => {
            if (name === 'Link') {
              return '<https://api.github.com/user/repos?page=2>; rel="next"';
            }
            return null;
          },
        },
      });

      const result = await getUserRepositories('testuser', 1);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser/repos?page=1&per_page=5&sort=updated',
        expect.objectContaining({
          headers: { Accept: 'application/vnd.github.v3+json' },
        }),
      );
      expect(result).toEqual({
        repositories: mockRepos,
        hasNextPage: true,
      });
    });

    it('should detect no next page when Link header is missing', async () => {
      const mockRepos: Repository[] = [
        {
          id: 1,
          name: 'repo1',
          description: 'Test repo',
          stargazers_count: 10,
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
        headers: {
          get: () => null,
        },
      });

      const result = await getUserRepositories('testuser');

      expect(result).toEqual({
        repositories: mockRepos,
        hasNextPage: false,
      });
    });

    it('should handle user not found error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getUserRepositories('nonexistent')).rejects.toThrow(
        'User not found.',
      );
    });

    it('should handle rate limit errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        headers: {
          get: (name: string) => {
            if (name === 'X-RateLimit-Remaining') {
              return '0';
            }
            return null;
          },
        },
        json: async () => ({}),
      });

      await expect(getUserRepositories('testuser')).rejects.toThrow(
        'API rate limit exceeded. Please try again later or add a GitHub token for higher limits.',
      );
    });

    it('should handle permission errors (403 without rate limit)', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        headers: {
          get: () => null,
        },
        json: async () => ({}),
      });

      await expect(getUserRepositories('testuser')).rejects.toThrow(
        'Access forbidden. Please check your GitHub token permissions.',
      );
    });

    it('should trim username', async () => {
      const mockRepos: Repository[] = [
        {
          id: 1,
          name: 'repo1',
          description: 'Test repo',
          stargazers_count: 10,
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
        headers: {
          get: () => null,
        },
      });

      await getUserRepositories('  testuser  ');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser/repos?page=1&per_page=5&sort=updated',
        expect.any(Object),
      );
    });

    it('should parse Link header correctly with multiple rels', async () => {
      const mockRepos: Repository[] = [
        {
          id: 1,
          name: 'repo1',
          description: 'Test repo',
          stargazers_count: 10,
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
        headers: {
          get: (name: string) => {
            if (name === 'Link') {
              return '<https://api.github.com/user/repos?page=2>; rel="next", <https://api.github.com/user/repos?page=10>; rel="last"';
            }
            return null;
          },
        },
      });

      const result = await getUserRepositories('testuser');

      expect(result.hasNextPage).toBe(true);
    });
  });
});
