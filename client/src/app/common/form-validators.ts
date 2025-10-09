import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { isValidPhoneNumber } from 'libphonenumber-js';

export abstract class FormValidators extends Validators {
  static match(controlName: string): ValidatorFn {
    return (control) => {
      const isSame = control.value === control.parent?.get(controlName)?.value;

      if (isSame) return null;

      return { match: true };
    };
  }

  static phoneNumber(control: AbstractControl): ValidationErrors | null {
    if (Validators.required(control)) return null;

    if (control.value && typeof control.value === 'string') {
      const isValid = isValidPhoneNumber(control.value);

      if (isValid) return null;
    }

    return { phoneNumber: true };
  }
}
