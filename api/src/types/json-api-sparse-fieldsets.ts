import { Nullable } from './nullable';

export class JsonApiSparseFieldsets {
  private fields: Map<string, string[]>;

  constructor() {
    this.fields = new Map();
  }

  get isEmpty() {
    return this.fields.size === 0;
  }

  contains(table: string): boolean {
    return this.fields.has(table);
  }

  sparseFields(table: string): Nullable<string[]> {
    return this.fields.get(table) || null;
  }

  add(table: string, fields: string[]): void {
    this.fields.set(table, fields);
  }

  forEach(callback: (table: string, fields: string[]) => void): void {
    Array.from(this.fields.entries()).forEach(([table, fields]) => {
      callback(table, fields);
    });
  }
}
