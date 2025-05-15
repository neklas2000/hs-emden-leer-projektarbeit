export class IterableObject<T_KEYS extends string, T = any> {
  private readonly data: Objectify<T_KEYS, T>;

  constructor(defaultData: Objectify<T_KEYS, T>) {
    this.data = defaultData;

    for (const key in this.data) {
      Object.assign(this, {
        [key]: {
          get: () => {
            return this.data[key];
          },
        },
      });
    }
  }

  *iterate() {
    for (const key in this.data) {
      yield {
        key,
        value: this.data[key],
      };
    }
  }

  getValue(key: T_KEYS): T {
    return this.data[key];
  }
}
