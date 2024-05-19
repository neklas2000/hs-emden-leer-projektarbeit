import { Pipe, PipeTransform } from '@angular/core';

import { Nullable, Undefinable } from '@Types';

@Pipe({
  name: 'undefinedString',
  standalone: true
})
export class UndefinedStringPipe implements PipeTransform {
  /**
   * This pipe takes a nullable or undefinable string literal and transforms the given value.
   * If no value is given or the literal has a length of zero a fallback literal will be returned.
   * Otherwise the given value is returned.
   *
   * @param value The original value to transform
   * @param fallback A fallback string literal for transformation - default: 'Nicht definiert'
   * @returns Either the original value or the fallback string literal
   */
  transform(value: Nullable<Undefinable<string>>, fallback: string = 'Nicht definiert'): string {
    if (!value || value.length === 0) return fallback;

    return value;
  }
}
