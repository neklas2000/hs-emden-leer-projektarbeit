import { Nullable, Undefinable } from '@Types';

export class UUID {
  static isWellFormed(input: Undefinable<Nullable<string>>): boolean {
    if (!input) return false;

    const regex = /^([a-f0-9]){8}-([a-f0-9]){4}-([a-f0-9]){4}-([a-f0-9]){4}-([a-f0-9]){12}$/;

    return regex.test(input.toLowerCase());
  }
}
