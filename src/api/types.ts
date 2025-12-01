export interface User {
  id: number;
  login: string;
  url: string;
}

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  html_url: string;
}

export interface SearchUsersResponse {
  total_count: number;
  incomplete_results: boolean;
  items: User[];
}

export interface RepositoryListResponse {
  repositories: Repository[];
  hasNextPage: boolean;
}
