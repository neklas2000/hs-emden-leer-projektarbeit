import { Nullable } from '@Types';

export class Tupel<T1, T2 = T1> {
  private values: [Nullable<T1>, Nullable<T2>] = [null, null];

  constructor(values?: [T1, T2]) {
    if (values) {
      this.values = values;
    }
  }

  set x(value: T1) {
    this.values[0] = value;
  }

  get x(): Nullable<T1> {
    return this.values[0];
  }

  set y(value: T2) {
    this.values[1] = value;
  }

  get y(): Nullable<T2> {
    return this.values[1];
  }

  reset(): void {
    this.values = [null, null];
  }

  get isEmpty(): boolean {
    return this.values[0] === null && this.values[1] === null;
  }
}
