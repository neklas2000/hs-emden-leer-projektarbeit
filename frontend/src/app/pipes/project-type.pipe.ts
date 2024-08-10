import { Pipe, PipeTransform } from '@angular/core';

import { Nullable } from '@Types';

/**
 * @description
 * This pipe transforms a nullable string literal and transforms it's value. If no value is given or
 * the string literal has a length of zero an empty string will be returned, otherwise the given
 * value is being populated into a label.
 */
@Pipe({
  name: 'projectType',
  standalone: true
})
export class ProjectTypePipe implements PipeTransform {
  /**
   * @description
   * This transform function takes a nullable string literal and transforms it's value. If no value
   * is given or the string literal has a length of zero an empty string will be returned, otherwise
   * the given value is being populated into a label.
   *
   * @param value The original value to be transformed.
   * @returns Either an empty string or a populated label.
   */
  transform(value: Nullable<string>): string {
    if (!value || value.length === 0) return '';

    return `vom Typ "${value}" -`;
  }
}
