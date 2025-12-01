import {
  DEFAULT_PER_PAGE_REPOS,
  DEFAULT_PER_PAGE_USERS,
  GITHUB_API_BASE,
  REQUEST_TIMEOUT,
  createHeaders,
} from './config';
import type {
  Repository,
  RepositoryListResponse,
  SearchUsersResponse,
} from './types';

function hasNextPage(linkHeader: string | null): boolean {
  if (!linkHeader) return false;

  const links = linkHeader.split(',').map((link) => link.trim());
  return links.some((link) => {
    const match = link.match(/rel="(.+?)"/);
    return match && match[1] === 'next';
  });
}

const ERROR_HANDLERS: Record<
  number,
  (operation: string, errorMessage: string) => string
> = {
  401: () => 'Authentication failed. Please check your GitHub token.',
  403: () =>
    'API rate limit exceeded. Please try again later or add a GitHub token for higher limits.',
  404: (operation) =>
    operation === 'search' ? 'No results found.' : 'User not found.',
  422: (_, errorMessage) =>
    errorMessage || 'Invalid search query. Please try a different search term.',
  503: () =>
    'GitHub service is temporarily unavailable. Please try again later.',
};

async function handleApiError(
  response: Response,
  operation: string,
): Promise<never> {
  const { status, statusText } = response;

  let errorMessage = '';
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || '';
  } catch (error) {
    console.debug('Failed to parse error response:', error);
  }

  const handler = ERROR_HANDLERS[status];
  const message = handler
    ? handler(operation, errorMessage)
    : `Failed to ${operation}: ${
        errorMessage || statusText || 'Unknown error'
      }`;

  throw new Error(message);
}

export async function searchUsers(
  query: string,
  page: number = 1,
): Promise<SearchUsersResponse> {
  try {
    const url = `${GITHUB_API_BASE}/search/users?q=${encodeURIComponent(
      query.trim(),
    )}&page=${page}&per_page=${DEFAULT_PER_PAGE_USERS}`;

    const response = await fetch(url, {
      headers: createHeaders(),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      await handleApiError(response, 'search');
    }

    const data: SearchUsersResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while searching users.');
  }
}

export async function getUserRepositories(
  username: string,
  page: number = 1,
): Promise<RepositoryListResponse> {
  try {
    const url = `${GITHUB_API_BASE}/users/${encodeURIComponent(
      username.trim(),
    )}/repos?page=${page}&per_page=${DEFAULT_PER_PAGE_REPOS}&sort=updated`;

    const response = await fetch(url, {
      headers: createHeaders(),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      await handleApiError(response, 'fetch repositories');
    }

    const repositories: Repository[] = await response.json();
    const linkHeader = response.headers.get('Link');
    const hasMore = hasNextPage(linkHeader);

    return {
      repositories,
      hasNextPage: hasMore,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      'An unexpected error occurred while fetching repositories.',
    );
  }
}
