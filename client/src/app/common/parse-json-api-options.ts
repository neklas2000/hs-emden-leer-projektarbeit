type SparseFieldsets = {
  [resource: string]: string[];
};

type Filters = {
  [field: string]: string | number | boolean | null;
};

export type JsonApiOptions = {
  sparseFieldsets?: SparseFieldsets;
  includes?: string[];
  filters?: Filters;
};

export function parseJsonApiOptions(options?: JsonApiOptions): string {
  if (!options) return '';
  if (Object.keys(options).length === 0) return '';
  if (
    !options.sparseFieldsets &&
    (!options.includes || options.includes.length === 0) &&
    (!options.filters || Object.keys(options.filters).length === 0)
  ) return '';

  const queryParams: string[] = [];

  if (options.sparseFieldsets) {
    for (const resource in options.sparseFieldsets) {
      queryParams.push(`fields[${resource}]=${options.sparseFieldsets[resource].join(',')}`);
    }
  }

  if (options.includes) {
    queryParams.push(`include=${options.includes.join(',')}`);
  }

  if (options.filters) {
    for (const field in options.filters) {
      if (options.filters[field] === null) {
        queryParams.push(`filter[${field}]=NULL`);
      } else {
        queryParams.push(`filter[${field}]=${options.filters[field]}`);
      }
    }
  }

  return `?${queryParams.join('&')}`;
}
