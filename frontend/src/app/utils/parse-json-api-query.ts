import { JsonApiQueries } from '@Types';

export function parseJsonApiQuery(query?: JsonApiQueries): string {
  if (!query) return '';

  let queries = [];

  if (query.includes) {
    queries.push(`include=${query.includes.join(',')}`);
  }

  if (query.sparseFieldsets) {
    for (const table in query.sparseFieldsets) {
      queries.push(`fields[${table}]=${query.sparseFieldsets[table].join(',')}`);
    }
  }

  if (query.filters) {
    for (const field in query.filters) {
      if (query.filters[field] === null) queries.push(`filter[${field}]=NULL`);
      else {
        queries.push(`filter[${field}]=${query.filters[field]}`);
      }
    }
  }

  if (queries.length === 0) return '';

  return `?${queries.join('&')}`;
}
