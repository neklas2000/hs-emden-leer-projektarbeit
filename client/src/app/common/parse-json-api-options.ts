import { isEmptyObject } from '../utils/is-empty-object';

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

function areOptionsDefinedInsufficiently(options: JsonApiOptions): boolean {
  if (options?.sparseFieldsets && !isEmptyObject(options.sparseFieldsets)) {
    return false;
  }

  if (options?.includes && options.includes.length === 0) return false;

  return !(options?.filters && !isEmptyObject(options.filters));
}

export function parseJsonApiOptions(options?: JsonApiOptions): string {
  if (!options) return '';
  if (isEmptyObject(options)) return '';
  if (areOptionsDefinedInsufficiently(options)) return '';

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
