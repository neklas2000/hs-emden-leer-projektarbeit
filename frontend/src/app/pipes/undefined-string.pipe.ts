import { Pipe, PipeTransform } from '@angular/core';

import { Nullable, Undefinable } from '@Types';

/**
 * @description
 * This pipe takes a nullable or undefinable string or number literal and transforms the given
 * value. If no value is given or the string literal has a length of zero a fallback literal will be
 * returned. Otherwise the given value is returned.
 */
@Pipe({
  name: 'undefinedString',
  standalone: true
})
export class UndefinedStringPipe implements PipeTransform {
  /**
   * @description
   * This transform function takes a nullable or undefinable string or number literal and transforms
   * it's value. If no value is given or the string literal has a length of zero a fallback literal
   * will be returned, otherwise the given value is returned.
   *
   * @param value The original value to be transformed.
   * @param fallback A fallback string literal for transformation - default: 'Nicht definiert'.
   * @returns Either the original value or the fallback string literal.
   */
  transform(
    value: Nullable<Undefinable<string | number>>,
    fallback: string = 'Nicht definiert',
  ): string {
    if (!value) return fallback;

    return `${value}`;
  }
}
