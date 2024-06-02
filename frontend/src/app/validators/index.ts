import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { isValidPhoneNumber } from 'libphonenumber-js';

import { Nullable } from '@Types';
import { DateService } from '@Services/date.service';

export class FormValidators extends Validators {
  private static dateService: DateService = new DateService();

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
        matchesInterval: {
          value: control.value,
        },
      };
    };
  }

  /**
   *
   * @param nameOfControlToCompareTo The name of the formcontrol which is used for the comparison
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
        behindDate: {
          value: control.value,
        },
      };
    };
  }

  /**
   * If the phone number is not valid the error `phoneNumber` will be set.
   */
  static phoneNumber(control: AbstractControl): Nullable<ValidationErrors> {
    if (!control.value || String(control.value).length === 0) return null;
    if (isValidPhoneNumber(control.value)) return null;

    return {
      phoneNumber: {
        value: control.value,
      },
    };
  }

  /**
   * If the value of this control and the other control (identified by the `controlName`) aren't
   * equal the error `matchingInputs` will be set.
   */
  static matchWith(controlName: string): ValidatorFn {
    return (control: AbstractControl): Nullable<ValidationErrors> => {
      if (!control.value || String(control.value).length === 0) return null;
      if (String(control.value) === String(control.parent?.get(controlName)?.value ?? '')) return null;

      return {
        matchingInputs: {
          value: control.value,
        },
      };
    };
  }
}
