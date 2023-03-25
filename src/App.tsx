import '@picocss/pico';
import { Fragment, useEffect } from 'react';
import { useInfiniteQueryTrendingReposCreatedFrom } from './query';
import { useInView } from 'react-intersection-observer';

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

  return (
    <>
      <header className="container">
        <h1>Trending GitHub Repos</h1>
      </header>
      <main className='container'>
        {status === 'error' ? (
          <span>Error: {(error as any).message}</span>
        ) : (
            <table>
                <thead>
                  <tr>
                    <th scope="col">Stars</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.pages.map(p => (
                    <Fragment key={p.pageIndex}>
                      {p.results.map(result => (
                        <tr key={result.id}>
                          <td>{result.stargazers_count}</td>
                          <td>{<a href={result.html_url}>{result.name}</a>}</td>
                          <td>{result.description}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                  <tr key="loadingRow" ref={loadingStatusRef} aria-busy={isFetchingNextPage} />
                </tbody>
          </table>
        )}
      </main>
    </>
  );
}

export default App;
