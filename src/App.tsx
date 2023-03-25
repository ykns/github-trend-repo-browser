import '@picocss/pico';
import { useEffect, useState } from 'react';
import { useInfiniteQueryTrendingReposCreatedFrom } from './query';
import { useInView } from 'react-intersection-observer';
import { GithubRepo } from './api';
import { setFavouriteRepos, getFavouriteRepos, SavedFavouriteGithubRepos } from './utils/storage';
import { GithubReposTable } from './components/github-repos-table';

function App() {
  const lastNumberOfDays = 7;
  const {
    data,
    status,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQueryTrendingReposCreatedFrom(lastNumberOfDays, 100);
  const { ref: loadingStatusRef, inView: loadingStatusInView } = useInView();
  useEffect(() => {
    if (loadingStatusInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [loadingStatusInView, fetchNextPage, hasNextPage, isFetchingNextPage]);
  const [savedRepoSearchResults, setSavedRepoSearchResults] = useState<SavedFavouriteGithubRepos>(getFavouriteRepos() ?? {});
  function handleAddToSavedFavouriteGithubRepos(repo: GithubRepo) {
    const newSavedRepoSearchResults = { ...savedRepoSearchResults, [repo.id]: repo };
    setSavedRepoSearchResults(newSavedRepoSearchResults);
    setFavouriteRepos(newSavedRepoSearchResults);
  }
  function handleRemoveFromSavedFavouriteGithubRepos(repo: GithubRepo) {
    const newSavedRepoSearchResults = { ...savedRepoSearchResults };
    delete newSavedRepoSearchResults[repo.id];
    setSavedRepoSearchResults(newSavedRepoSearchResults);
    setFavouriteRepos(newSavedRepoSearchResults);
  }
  type TabType = 'all' | 'fav';
  const [tab, setTab] = useState<TabType>('all');
  function handleSelectedTabChange(tab: 'all' | 'fav') {
    setTab(tab);
  }

  return (
    <>
      <header className="container">
        <h1>Trending GitHub Repos</h1>
      </header>
      <main className='container'>
      <select onChange={(event) => handleSelectedTabChange(event.target.value as TabType)}>
        <option value="all">All</option>
        <option value="fav">Favourites</option>
      </select>
        {tab === 'all' ? (
          <div>
            {status === 'error' ? (
              <span>Error: {(error as any).message}</span>
            ) : (
              <GithubReposTable data={data}
                hasFavorite={(repoId) => savedRepoSearchResults[repoId] ? true : false}
                addFavourite={handleAddToSavedFavouriteGithubRepos}
                removeFavourite={handleRemoveFromSavedFavouriteGithubRepos}>
                <tr key="loadingRow" ref={loadingStatusRef} aria-busy={isFetchingNextPage} />
              </GithubReposTable>
            )}
          </div>) : ( 
          <div>
              <GithubReposTable data={{
                pages: [{
                  pageIndex: 0,
                  results: Object.values(savedRepoSearchResults).sort((a, b) => b.stargazers_count - a.stargazers_count)
                }]
            }}
              hasFavorite={(repoId) => savedRepoSearchResults[repoId] ? true : false}
              addFavourite={handleAddToSavedFavouriteGithubRepos}
              removeFavourite={handleRemoveFromSavedFavouriteGithubRepos} />
          </div>
        )}
      </main>
    </>
  );
}

export default App;
