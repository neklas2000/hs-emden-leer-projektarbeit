export class JsonApiFilters {
  private filters: Map<string, string>;

  constructor() {
    this.filters = new Map();
  }

  get isEmpty() {
    return this.filters.size === 0;
  }

  add(field: string, value: string): void {
    this.filters.set(field, value);
  }

  forEach(callback: (field: string, value: string) => void): void {
    Array.from(this.filters.entries()).forEach(([field, value]) => {
      callback(field, value);
    });
  }
}
