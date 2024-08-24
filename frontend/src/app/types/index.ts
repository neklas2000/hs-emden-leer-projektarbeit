export type Nullable<T> = T | null;

export type Undefinable<T> = T | undefined;

/**
 * @description
 * This type was copied from the library typeorm.
 *
 * @see [TypeORM DeepPartial definition](https://github.com/typeorm/typeorm/blob/master/src/common/DeepPartial.ts)
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

export type DeepPartialWithIdField<T> = DeepPartial<T> & { id: string; };
