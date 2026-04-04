import qs from 'query-string';

export function getSearchObj() {
  const search = typeof window !== 'undefined' && window.location.search;
  const query = qs.parse(search);

  return query || {};
}

export function buildLocalizedPath(
  pathname: string,
  extraQuery: Record<string, string | number | boolean | undefined> = {}
): string {
  const currentQuery = getSearchObj();
  const nextQuery = {
    ...currentQuery,
    ...extraQuery,
  };

  const search = qs.stringify(nextQuery, {
    skipEmptyString: true,
    skipNull: true,
  });

  return search ? `${pathname}?${search}` : pathname;
}
