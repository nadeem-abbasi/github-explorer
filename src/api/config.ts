/**
 * API Configuration
 * This file handles environment-specific configuration
 */

export const GITHUB_API_BASE = 'https://api.github.com';
export const DEFAULT_PER_PAGE_USERS = 30;
export const DEFAULT_PER_PAGE_REPOS = 5;
export const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * Get GitHub token from environment variables
 * Uses optional chaining to safely access import.meta in test environments
 */
export const getGitHubToken = (): string | undefined => {
  // This will be replaced by Vite at build time, but safely handled in tests
  return import.meta.env?.VITE_GITHUB_TOKEN as string | undefined;
};

/**
 * Create headers for GitHub API requests
 * Includes authentication token if available and sets API version
 */
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
