type ObjectifyIterator<T_UNION, T> = {
  key: T_UNION;
  value: T;
};

type Objectify<T_UNION extends string, T = any> = {
  [K in T_UNION]: T;
};

type ObjectifyWithIterator2<T_UNION extends string, T = any> = Objectify<T_UNION, T> & {
  iterate(): ObjectifyIterator<T_UNION, T>[];
};

interface ObjectifyWithIterator<T_UNION extends string, T = any> {
  iterate(): ObjectifyIterator<T_UNION, T>[];
}

type UUID = `${string}-${string}-${string}-${string}-${string}`;
