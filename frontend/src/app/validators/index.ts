import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { isValidPhoneNumber } from 'libphonenumber-js';

import { Nullable } from '@Types';
import { DateService } from '@Services/date.service';

/**
 * @description These FormValidators extend the existing Validators from the library
 * "@angular/forms". The additional validators are `matchesInterval`, `behindDate`, `phoneNumber`
 * and `matchWith`.
 *
 * @usageNotes
 * ### Using the validators with form controls
 * ```js
 * const control = new FormControl('', [FormValidators.required, FormValidators.phoneNumber])
 * ```
 */
export class FormValidators extends Validators {
  private static dateService: DateService = new DateService();

  /**
   * @description Validator that requires that two controls (getting a date as input) have a
   * difference which matches a given interval. The dates have to be provided as a DateTime object
   * from the library "luxon". If that's not possible the date object needs to provide a function
   * `toFormat`, which creates a string representation of the date (e.g. in the format "yyyy-MM-dd").
   *
   * @usageNotes
   * ### Validate that both controls have a difference matching the interval (as number)
   * ```js
   * const formBuilder = inject(FormBuilder); // Inside of an injection context
   * const form = formBuilder.group({
   *    controlA: [DateTime.now(), [FormValidators.required]],
   *    controlB: [DateTime.now().plus({ day: 1 });, [FormValidators.required, FormValidators.matchesInterval('controlA', 7)]],
   * });
   * ```
   *
   * ### Validate that both controls have a difference matching the interval (as string)
   * ```js
   * const formBuilder = inject(FormBuilder); // Inside of an injection context
   * const form = formBuilder.group({
   *    controlA: [DateTime.now(), [FormValidators.required]],
   *    interval: [7, [FormValidators.required, FormValidators.min(1)]],
   *    controlB: [DateTime.now().plus({ day: 1 });, [FormValidators.required, FormValidators.matchesInterval('controlA', 'interval')]],
   * });
   *
   * console.log(form.get('controlB').errors); // { matchesInterval: true }
   * ```
   *
   * @param nameOfControlToCompareTo The name of the form control which is used for the comparison
   * @param interval Either the actual interval as a number or a name of a form control containing
   * a dynamic interval value.
   * @returns
   * A validator function populated by the `nameOfControlToCompareTo` and the `interval`. The
   * validator function will return an error map with the property `matchesInterval` if the
   * validation check fails, otherwise null.
   */
  static matchesInterval(nameOfControlToCompareTo: string, interval: number | string): ValidatorFn {
    return (control: AbstractControl): Nullable<ValidationErrors> => {
      if (!control.value) return null;

      const otherControl = control.parent?.get(nameOfControlToCompareTo);

      if (!otherControl?.value) return null;

      let daysInterval: number;

      if (typeof interval === 'number') {
        daysInterval = interval;
      } else {
        daysInterval = Number(control.parent?.get(interval)?.value ?? 1);
      }

      const diff = this.dateService.compare(
        control.value.toFormat('yyyy-MM-dd'),
        otherControl.value.toFormat('yyyy-MM-dd'),
      );

      if (diff % daysInterval === 0) return null;

      return {
        matchesInterval: true,
      };
    };
  }

  /**
   * @description Validator that requires that two controls (getting a date as input) have a
   * difference greater than zero. The dates have to be provided as a DateTime object from the
   * library "luxon". If that's not possible the date object needs to provide a function `toFormat`,
   * which creates a string representation of the date (e.g. in the format "yyyy-MM-dd").
   *
   * @usageNotes
   * ### Validate that both controls have a difference greater than zero
   * ```js
   * const formBuilder = inject(FormBuilder); // Inside of an injection context
   * const form = formBuilder.group({
   *    controlA: [DateTime.now(), [FormValidators.required]],
   *    controlB: [DateTime.now().plus({ day: 1 });, [FormValidators.required, FormValidators.behindDate('controlA')]],
   * });
   *
   * console.log(form.get('controlB').errors); // { behindDate: true }
   * ```
   *
   * @param nameOfControlToCompareTo The name of the form control which is used for the comparison
   * @returns
   * A validator function populated by the `nameOfControlToCompareTo`. The validator function will
   * return an error map with the property `behindDate` if the validation check fails,
   * otherwise null.
   */
  static behindDate(nameOfControlToCompareTo: string): ValidatorFn {
    return (control: AbstractControl): Nullable<ValidationErrors> => {
      if (!control.value) return null;

      const valueOfOtherControl = control.parent?.get(nameOfControlToCompareTo)?.value;

      if (!valueOfOtherControl) return null;

      const diff = this.dateService.compare(
        control.value.toFormat('yyyy-MM-dd'),
        valueOfOtherControl.toFormat('yyyy-MM-dd'),
      );

      if (diff > 0) return null;

      return {
        behindDate: true,
      };
    };
  }

  /**
   * @description Validator that requires the control to be a valid phone number.
   *
   * @usageNotes
   * ### Validate that the control is a valid phone number
   * ```js
   * const control = new FormControl('-49 1234 1234567', [FormValidators.phoneNumber]);
   *
   * console.log(control).errors); // { phoneNumber: true }
   * ```
   * @returns
   * An error map with the property `phoneNumber` if the validation check fails, otherwise null.
   */
  static phoneNumber(control: AbstractControl): Nullable<ValidationErrors> {
    if (!control.value || String(control.value).length === 0) return null;
    if (isValidPhoneNumber(control.value)) return null;

    return {
      phoneNumber: true,
    };
  }

  /**
   * @description Validator that requires the control to have the same value as the other control
   * (identified by the `controlName`).
   *
   * @usageNotes
   * ### Validate that the controls have the same value
   * ```js
   * const formBuilder = inject(FormBuilder); // Inside of an injection context
   * const form = formBuilder.group({
   *    controlA: ['', [FormValidators.required]],
   *    controlB: ['', [FormValidators.required, FormValidators.matchWith('controlA')]],
   * });
   *
   * console.log(form.get('controlB').errors); // { matchingInputs: true }
   * ```
   * @returns
   * A validator function populated by the `controlName`. The validator function will return an
   * error map with the property `matchingInputs` if the validation check fails, otherwise null.
   */
  static matchWith(controlName: string): ValidatorFn {
    return (control: AbstractControl): Nullable<ValidationErrors> => {
      if (!control.value || String(control.value).length === 0) return null;
      if (String(control.value) === String(control.parent?.get(controlName)?.value ?? '')) return null;

      return {
        matchingInputs: true,
      };
    };
  }
}
