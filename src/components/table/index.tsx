import { Fragment, useState } from 'react';

type ColumnDefinition<T> = {
  valueFn?: (item: T) => string | null; 
  filterByValue?: boolean;
  childrenFn?: (item: T) => React.ReactNode;
  label: string;
  width: string;
}
export type PageResultTableProps<T> = {
  pages: { pageIndex: number; results: T[] }[];
  getIdFn: (item: T) => string;
  columnsDefinitions: ColumnDefinition<T>[];
  children?: React.ReactNode;
}

type ColumnOptionsProps = {
  values: (string | null | undefined)[];
  onChange: (value: string) => void;
}

function ColumnOptions({ values, onChange }: ColumnOptionsProps) {
  return (
    <select style={{ marginTop: '1em'}} onChange={(e) => onChange(e.target.value)}>
      {values.map(v => <option key={v}>{v ? v : '[None specified]'}</option>)}
    </select>
  );
}

export function PageResultsTable<T>({ pages, getIdFn, columnsDefinitions, children }: PageResultTableProps<T>) {
  const allColumnsDistinctValues: { [k: string]: Set<string | null | undefined> } = columnsDefinitions
    .filter(c => c.valueFn && c.filterByValue)
    .reduce((acc, c) => ({ ...acc, [c.label]: new Set<string | null | undefined>(pages.flatMap(p => p.results).map(r => c.valueFn && c.valueFn(r))) }), { });
  const [allColumnsSelectedValues, setAllColumnsSelectedValues] = useState<{ [key: string]: string | null }>({});
  
  return (
    <table style={{ width: '100%', tableLayout: 'fixed' }} role='grid'>
      <thead>
        <tr>
          {columnsDefinitions.map(c =>
          (<th scope='col' style={{ width: c.width }} key={c.label}>{!c.filterByValue ? c.label : (
            <>
              {
                allColumnsDistinctValues[c.label]
                  && <ColumnOptions 
                    values={[c.label, ...allColumnsDistinctValues[c.label]]}
                    onChange={(value) => {
                      if (value !== c.label) {
                        setAllColumnsSelectedValues(f => ({ ...f, [c.label]: value }));
                      } else {
                        setAllColumnsSelectedValues(f => {
                          const copy = { ...f };
                          delete copy[c.label];
                          return copy;
                        });
                      }
                    }} />
              }
            </>
            )}</th>)
          )}
        </tr>
      </thead>
      <tbody>
        {pages.map(p =>
          <Fragment key={p.pageIndex}>
            {p.results.reduce((acc, item) => {
              let isFiltered = false;
              const tds = [] as (React.ReactNode)[];
              for (const c of columnsDefinitions) {
                if (c.valueFn) {
                  const value = c.valueFn(item);
                  if (c.filterByValue
                    && c.label in allColumnsSelectedValues
                    && allColumnsSelectedValues[c.label] !== value) {
                    isFiltered = true;
                    break;  
                  }
                  tds.push(<td key={c.label}>{c.valueFn(item)}</td>);
                } else if (c.childrenFn) {
                  tds.push(<td key={c.label}>{c.childrenFn(item)}</td>);
                } else {
                  tds.push(<td key={c.label}/>);
                }
              }
              if (!isFiltered) {
                acc.push((
                  <tr key={getIdFn(item)}>
                    {...tds}
                  </tr>
                ));
              }
              return acc;
            }, [] as React.ReactNode[])}
          </Fragment>)}
        {children}
      </tbody>
    </table>
  );
}