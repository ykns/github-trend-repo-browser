import { Fragment } from 'react';
import { GithubRepo } from '../../api';

export type TableProps = {
  data: {
    pages: {
      pageIndex: number;
      results: GithubRepo[];
    }[];
  } | undefined;
  hasFavorite: (repoId: number) => boolean;
  addFavourite: (repo: GithubRepo) => void;
  removeFavourite: (repo: GithubRepo) => void;
  children?: React.ReactNode;
}

export function GithubReposTable({ data,
  children,
  hasFavorite,
  addFavourite,
  removeFavourite
}: TableProps) {
  return (<table style={{ width: '100%'}}>
    <thead>
      <tr>
        <th scope="col" style={{ width: '10%'}}>Stars</th>
        <th scope="col" style={{ width: '30%'}}>Name</th>
        <th scope="col" style={{ width: '50%'}}>Description</th>
        <th scope="col" style={{ maxWidth: '10%', minWidth: '10%'}}>Actions</th>
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
              <td>
                {!hasFavorite(result.id)
                  ? (<button onClick={() => addFavourite(result)}>Fav</button>)
                  : (<button onClick={() => removeFavourite(result)}>Unfav</button>)}
              </td>
            </tr>
          ))}
        </Fragment>
      ))}
      {children}
    </tbody>
  </table>);

}