import '@picocss/pico';
import { useEffect, useState } from 'react';
import { useInfiniteQueryTrendingReposCreatedFrom } from './query';
import { useInView } from 'react-intersection-observer';
import { GithubRepo } from './api';
import { setFavouriteRepos, getFavouriteRepos, SavedFavouriteGithubRepos } from './utils/storage';
import { PageResultsTable } from './components/table';

function App() {
  const lastNumberOfDays = 7;
  const { data, status, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQueryTrendingReposCreatedFrom(lastNumberOfDays, 100);
  const { ref: loadingStatusRef, inView: loadingStatusInView } = useInView();
  useEffect(() => {
    if (loadingStatusInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [loadingStatusInView, fetchNextPage, hasNextPage, isFetchingNextPage]);
  const [savedRepoSearchResults, setSavedRepoSearchResults] = useState<SavedFavouriteGithubRepos>(
    getFavouriteRepos() ?? {}
  );
  function handleAddToSavedFavouriteGithubRepos(repo: GithubRepo) {
    const newSavedRepoSearchResults = {
      ...savedRepoSearchResults,
      [repo.id]: repo,
    };
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
      <header className="container" style={{ textAlign: 'center' }}>
        <h1>Trending GitHub Repos</h1>
      </header>
      <main className="container">
        <select onChange={(event) => handleSelectedTabChange(event.target.value as TabType)}>
          <option value="all">All</option>
          <option value="fav">Favourites</option>
        </select>
        {tab === 'all' ? (
          <div>
            {status === 'error' ? (
              <span>Error: {(error as any).message}</span>
            ) : (
              data && (
                <PageResultsTable<GithubRepo>
                  pages={data.pages}
                  getIdFn={(item) => item.id.toString()}
                  columnsDefinitions={[
                    {
                      label: 'Stars',
                      width: '10%',
                      valueFn: (item) => item.stargazers_count.toString(),
                    },
                    {
                      label: 'Name',
                      width: '20%',
                      childrenFn: (item) => (
                        <a href={item.html_url} target="_blank" rel="noreferrer">
                          {item.name}
                        </a>
                      ),
                    },
                    {
                      label: 'Lang',
                      width: '20%',
                      valueFn: (item) => item.language,
                      filterByValue: true,
                    },
                    {
                      label: 'Description',
                      width: '35%',
                      valueFn: (item) => item.description,
                    },
                    {
                      label: 'Actions',
                      width: '15%',
                      childrenFn: (item) => (
                        <>
                          {savedRepoSearchResults[item.id] ? (
                            <button onClick={() => handleRemoveFromSavedFavouriteGithubRepos(item)}>Unfav</button>
                          ) : (
                            <button onClick={() => handleAddToSavedFavouriteGithubRepos(item)}>Fav</button>
                          )}
                        </>
                      ),
                    },
                  ]}
                >
                  <tr key="loadingRow" ref={loadingStatusRef} aria-busy={isFetchingNextPage} />
                </PageResultsTable>
              )
            )}
          </div>
        ) : (
          <div>
            <PageResultsTable<GithubRepo>
              pages={[
                {
                  pageIndex: 0,
                  results: Object.values(savedRepoSearchResults).sort(
                    (a, b) => b.stargazers_count - a.stargazers_count
                  ),
                },
              ]}
              getIdFn={(item) => item.id.toString()}
              columnsDefinitions={[
                {
                  label: 'Stars',
                  width: '10%',
                  valueFn: (item) => item.stargazers_count.toString(),
                },
                {
                  label: 'Name',
                  width: '20%',
                  childrenFn: (item) => (
                    <a href={item.html_url} target="_blank" rel="noreferrer">
                      {item.name}
                    </a>
                  ),
                },
                {
                  label: 'Lang',
                  width: '20%',
                  valueFn: (item) => item.language,
                  filterByValue: true,
                },
                {
                  label: 'Description',
                  width: '35%',
                  valueFn: (item) => item.description,
                },
                {
                  label: 'Actions',
                  width: '15%',
                  childrenFn: (item) => (
                    <>
                      {savedRepoSearchResults[item.id] ? (
                        <button onClick={() => handleRemoveFromSavedFavouriteGithubRepos(item)}>Unfav</button>
                      ) : (
                        <button onClick={() => handleAddToSavedFavouriteGithubRepos(item)}>Fav</button>
                      )}
                    </>
                  ),
                },
              ]}
            />
          </div>
        )}
      </main>
    </>
  );
}

export default App;
