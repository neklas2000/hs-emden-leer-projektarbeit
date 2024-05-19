import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { isValidPhoneNumber } from 'libphonenumber-js';

import { Nullable } from '@Types';

export class FormValidators extends Validators {
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
