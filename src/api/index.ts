import axios from 'axios';
import { formatDateAsISO, subtractDays } from '../utils/date';

export type GithubRepo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string | null;
};

export type GithubRepoSearchPage = {
  pageIndex: number;
  results: GithubRepo[];
};

export function createFetchTrendingReposCreatedFrom(lastNumberOfDays: number, reposPerPage: number) {
  const from = formatDateAsISO(subtractDays(new Date(), lastNumberOfDays));
  return async function (pageIndex: number): Promise<GithubRepoSearchPage> {
    const url = `https://api.github.com/search/repositories?q=created:%3E${from}&sort=stars&order=desc&page=${pageIndex}&per_page=${reposPerPage}`;
    const response = await axios.get<{
      total_count: number;
      incomplete_results: boolean;
      items: GithubRepo[];
    }>(url, {
      headers: {
        ...(import.meta.env.VITE_GITHUB_PAT && {
          Authorization: `token ${import.meta.env.VITE_GITHUB_PAT}`,
        }),
      },
    });
    return {
      results: response.data.items,
      pageIndex,
    };
  };
}
