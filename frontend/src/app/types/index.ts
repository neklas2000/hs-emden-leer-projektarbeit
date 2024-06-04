export type Nullable<T> = T | null;

export type Undefinable<T> = T | undefined;

/**
 * This type was copied from the library typeorm.
 *
 * @see https://github.com/typeorm/typeorm/blob/master/src/common/DeepPartial.ts
 */
export type DeepPartial<T> =
  | T
  | (T extends Array<infer U>
    ? DeepPartial<U>[]
    : T extends Map<infer K, infer V>
    ? Map<DeepPartial<K>, DeepPartial<V>>
    : T extends Set<infer M>
    ? Set<DeepPartial<M>>
    : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T);

export type JsonApiQueries = {
  includes?: string[];
  sparseFieldsets?: {
    [table: string]: string[];
  };
  filters?: {
    [field: string]: Nullable<string | number | boolean>;
  };
};

/**
 * The provided keys will be combined with a colon to replace the value within the provided route.
 */
export type RequestIds = {
  [key: string]: any;
};
