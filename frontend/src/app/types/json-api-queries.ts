import { Nullable } from './nullable';

export type JsonApiQueries = {
  includes?: string[];
  sparseFieldsets?: {
    [table: string]: string[];
  };
  filters?: {
    [field: string]: Nullable<string | number | boolean>;
  };
};
