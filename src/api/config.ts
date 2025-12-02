export const GITHUB_API_BASE = 'https://api.github.com';
export const DEFAULT_PER_PAGE_USERS = 30;
export const DEFAULT_PER_PAGE_REPOS = 5;
export const REQUEST_TIMEOUT = 10000;

export const QUERY_STALE_TIME = 1000 * 60 * 5;
export const QUERY_RETRY_COUNT = 2;
export const QUERY_REFETCH_ON_WINDOW_FOCUS = false;

export const getGitHubToken = (): string | undefined => {
  return import.meta.env?.VITE_GITHUB_TOKEN as string | undefined;
};

export function createHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };

  const token = getGitHubToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}
