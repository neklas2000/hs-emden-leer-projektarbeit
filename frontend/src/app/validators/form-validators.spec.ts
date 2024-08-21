import { FormControl } from '@angular/forms';

import { FormValidators } from '@Validators';

describe('Validator: FormValidators', () => {
  describe('matchesInterval(string, number | string): ValidatorFn', () => {
    it('should return null, since the control has no value', () => {
      expect(FormValidators.matchesInterval('otherControl', 7)({ value: null } as any)).toBeNull();
    });

    it('should return null, since the other control (used for comparison) has no value', () => {
      expect(FormValidators.matchesInterval('otherControl', 7)({
        value: '2024-01-01',
        parent: {
          get: () => ({
            value: null,
          }),
        },
      } as any)).toBeNull();
    });

    it('should return null, since the dates are within the same interval', () => {
      const dateServiceCompareSpy = spyOn(FormValidators['dateService'], 'compare').and.callThrough();
      const dateServiceCompareToString = spyOn(FormValidators['dateService'], 'toString').and.callThrough();

      const result = FormValidators.matchesInterval('otherControl', 7)({
        value: '2024-01-01',
        parent: {
          get: () => ({
            value: '2024-01-08',
          }),
        },
      } as any);

      expect(result).toBeNull();
      expect(dateServiceCompareToString).toHaveBeenCalledTimes(2);
      expect(dateServiceCompareSpy).toHaveBeenCalled();
    });

    it('should return null, since the dates are within the same interval (fallback to 1)', () => {
      const dateServiceCompareSpy = spyOn(FormValidators['dateService'], 'compare').and.callThrough();
      const dateServiceCompareToString = spyOn(FormValidators['dateService'], 'toString').and.callThrough();

      const result = FormValidators.matchesInterval('otherControl', 'interval')({
        value: '2024-01-01',
        parent: {
          get: (control: string) => {
            if (control === 'interval') return undefined;

            return {
              value: '2024-01-07',
            };
          },
        },
      } as any);

      expect(result).toBeNull();
      expect(dateServiceCompareToString).toHaveBeenCalledTimes(2);
      expect(dateServiceCompareSpy).toHaveBeenCalled();
    });

    it('should return an error, since the dates are not within the same interval', () => {
      const dateServiceCompareSpy = spyOn(FormValidators['dateService'], 'compare').and.callThrough();
      const dateServiceCompareToString = spyOn(FormValidators['dateService'], 'toString').and.callThrough();

      const result = FormValidators.matchesInterval('otherControl', 'interval')({
        value: '2024-01-01',
        parent: {
          get: (control: string) => {
            if (control === 'interval') return {
              value: 7,
            };

            return {
              value: '2024-01-06',
            };
          },
        },
      } as any);

      expect(result).toEqual({
        matchesInterval: true,
      });
      expect(dateServiceCompareToString).toHaveBeenCalledTimes(2);
      expect(dateServiceCompareSpy).toHaveBeenCalled();
    });
  });

  describe('behindDate(string): ValidatorFn', () => {
    it('should return null, since the control has no value', () => {
      expect(FormValidators.behindDate('otherControl')({ value: null } as any)).toBeNull();
    });

    it('should return null, since the other control (used for comparison) has no value', () => {
      expect(FormValidators.behindDate('otherControl')({
        value: '2024-01-01',
        parent: {
          get: () => ({
            value: null,
          }),
        },
      } as any)).toBeNull();
    });

    it('should return null, since the date of the control is behind the date of the other control', () => {
      const dateServiceCompareSpy = spyOn(FormValidators['dateService'], 'compare').and.callThrough();
      const dateServiceCompareToString = spyOn(FormValidators['dateService'], 'toString').and.callThrough();

      const result = FormValidators.behindDate('controlB')({
        value: '2024-01-02',
        parent: {
          get: () => ({
            value: '2024-01-01',
          }),
        },
      } as any);

      expect(result).toBeNull();
      expect(dateServiceCompareToString).toHaveBeenCalledTimes(2);
      expect(dateServiceCompareSpy).toHaveBeenCalled();
    });

    it('should return an error, since the date is not behind the date of the other control', () => {
      const dateServiceCompareSpy = spyOn(FormValidators['dateService'], 'compare').and.callThrough();
      const dateServiceCompareToString = spyOn(FormValidators['dateService'], 'toString').and.callThrough();

      const result = FormValidators.behindDate('controlB')({
        value: '2024-01-01',
        parent: {
          get: () => ({
            value: '2024-01-02',
          }),
        },
      } as any);

      expect(result).toEqual({
        behindDate: true,
      });
      expect(dateServiceCompareToString).toHaveBeenCalledTimes(2);
      expect(dateServiceCompareSpy).toHaveBeenCalled();
    });
  });

  describe('phoneNumber(AbstractControl): Nullable<ValidationErrors>', () => {
    it('should return null, since the control has no value', () => {
      expect(FormValidators.phoneNumber({ value: null } as any)).toBeNull();
    });

    it('should return null, since the value is a valid phone number', () => {
      expect(FormValidators.phoneNumber({ value: '+49 1234 1234567890' } as any)).toBeNull();
    });

    it('should return an error, since the value is an invalid phone number', () => {
      expect(FormValidators.phoneNumber({ value: '+49 1234 ABC4567890' } as any)).toEqual({
        phoneNumber: true,
      });
    });
  });

  describe('matchWith(string): ValidatorFn', () => {
    it("should report that both controls have the same value since the given control's value is null", () => {
      const controlStub = {
        value: null,
      } as any as FormControl;

      expect(FormValidators.matchWith('controlA')(controlStub)).toBeNull();
    });

    it('should return null, since both values are equal', () => {
      const validatorFn = FormValidators.matchWith('controlA');
      const result = validatorFn({
        value: 'Equal Value',
        parent: {
          get: (_: string) => {
            return {
              value: 'Equal Value',
            };
          },
        },
      } as any);

      expect(result).toBeNull();
    });

    it('should return an error, since both values do not match', () => {
      const validatorFn = FormValidators.matchWith('controlA');
      const result = validatorFn({
        value: 'Value A',
        parent: {
          get: (_: string) => {
            return {
              value: null,
            };
          },
        },
      } as any);

      expect(result).toEqual({
        matchingInputs: true,
      });
    });
  });

  describe('withinInterval(string, number, Nullable<string>?): ValidatorFn', () => {
    it('should return null, since there is no value defined', () => {
      const validatorFn = FormValidators.withinInterval('2024-01-01', 7);
      const result = validatorFn({
        value: null,
      } as any);

      expect(result).toBeNull();
    });

    it('should return null, since the date is within the interval', () => {
      const dateServiceIsWithinIntervalSpy = spyOn(
        FormValidators['dateService'],
        'isWithinInterval'
      ).and.returnValue(true);

      const validatorFn = FormValidators.withinInterval('2024-01-01', 7);
      const result = validatorFn({
        value: '2024-01-08',
      } as any);

      expect(dateServiceIsWithinIntervalSpy).toHaveBeenCalledWith('2024-01-08', 7, '2024-01-01', null);
      expect(result).toBeNull();
    });

    it('should return an error, since the date is not within the interval', () => {
      const dateServiceIsWithinIntervalSpy = spyOn(
        FormValidators['dateService'],
        'isWithinInterval'
      ).and.returnValue(false);

      const validatorFn = FormValidators.withinInterval('2024-01-01', 7);
      const result = validatorFn({
        value: '2024-01-07',
      } as any);

      expect(dateServiceIsWithinIntervalSpy).toHaveBeenCalledWith('2024-01-07', 7, '2024-01-01', null);
      expect(result).toEqual({
        outsideInterval: true,
      });
    });
  });
});
