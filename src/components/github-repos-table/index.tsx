import { Fragment, useState } from 'react';
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
type LanguageOptionType = string | null | undefined /* special case for all, as `null` can be a valid language option */;
export function GithubReposTable({ data,
  children,
  hasFavorite,
  addFavourite,
  removeFavourite
}: TableProps) {
  const [languageOption, setLanguageOption] = useState<LanguageOptionType>(undefined);
  function handleLanguageOptionChange(newLanguageOption: LanguageOptionType) {
    setLanguageOption(newLanguageOption);
  }
  const languageOptions = data?.pages.flatMap(p => p.results).reduce((acc, curr) => {
    acc.set(curr.language, curr.language === null ? '[None]' : curr.language);
    return acc;
  }, new Map()) ?? new Map();

  const pages = languageOption === undefined ? data?.pages : data?.pages.map(p => ({ pageIndex: p.pageIndex, results: p.results.filter(r => r.language === languageOption)}));
  
  return (<>
  <select onChange={(event) => handleLanguageOptionChange(event.target.value as LanguageOptionType)}>
      {[...languageOptions.entries()].map(([k, v]) => (<option key={v} value={k}>{v}</option>))}
  </select>
  <table style={{ width: '100%'}}>
    <thead>
      <tr>
        <th scope="col" style={{ width: '10%'}}>Stars</th>
        <th scope="col" style={{ width: '30%'}}>Name</th>
        <th scope="col" style={{ width: '50%'}}>Description</th>
        <th scope="col" style={{ maxWidth: '10%', minWidth: '10%'}}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {pages?.map(p => (
        <Fragment key={p.pageIndex}>
          {p.results.map(result => (
            <tr key={result.id}>
              <td>{result.stargazers_count}</td>
              <td>{<a href={result.html_url} target="_blank">{result.name}</a>}</td>
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
  </table></>);

}