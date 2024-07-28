import { Pipe, PipeTransform } from '@angular/core';

import { User } from '@Models/user';

/**
 * @description
 * This pipe takes an object of an user and joins the academic title, the full name and optionally
 * the matriculation number. If the matriculation number should be returned aswell, then the pipes
 * argument `includeMatriculationNumber` needs to be set to `true` (which is the default value).
 */
@Pipe({
  name: 'fullTitleName',
  standalone: true
})
export class FullTitleNamePipe implements PipeTransform {
  /**
   * @description
   * This transform function takes an object of an user and joins the academic title, the full name
   * and optionally the matriculation number. If the matriculation number should be returned aswell,
   * then the pipes argument `includeMatriculationNumber` needs to be set to `true` (which is the
   * default value).
   *
   * @usageNotes
   * ### Show the academic title, the full name and the matriculation number
   * ```html
   * <mat-list-item>
   *    <span matListItemTitle>{{ student | fullTitleName }}</span>
   * </mat-list-item>
   * ```
   *
   * ### Show the academic title and the full name, but without the matriculation number
   * ```html
   * <mat-list-item>
   *    <span matListItemTitle>{{ student | fullTitleName:false }}</span>
   * </mat-list-item>
   * ```
   *
   * @param value The object of an user which will be transformed.
   * @param includeMatriculationNumber A flag indicating if the matriculation number should be
   *                                   returned aswell - default: `true`.
   * @returns The concatenation of the academic title, the full name and optionally the
   * matriculation number.
   */
  transform(value: User, includeMatriculationNumber: boolean = true): string {
    const parts: string[] = [];

    if (value.academicTitle) {
      parts.push(value.academicTitle);
    }

    parts.push(value.firstName, value.lastName);

    if (includeMatriculationNumber) {
      parts.push(`(${value.matriculationNumber})`);
    }

    return parts.join(' ');
  }
}
