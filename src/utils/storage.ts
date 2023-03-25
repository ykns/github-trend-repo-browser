import { GithubRepo } from '../api';

export type SavedFavouriteGithubRepos = { [key: string]: GithubRepo };

export function getFavouriteRepos(): SavedFavouriteGithubRepos | null {
  const searchResults = localStorage.getItem('savedRepos');
  if (!searchResults) return null;

  return JSON.parse(searchResults);
}

export function setFavouriteRepos(searchResults: SavedFavouriteGithubRepos) {
  localStorage.setItem('savedRepos', JSON.stringify(searchResults));
}