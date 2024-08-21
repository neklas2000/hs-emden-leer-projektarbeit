import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  RegisterCredentialsComponent
} from '@Components/auth/register/register-credentials/register-credentials.component';

describe('Component: RegisterCredentialsComponent', () => {
  let component: RegisterCredentialsComponent;
  let fixture: ComponentFixture<RegisterCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [FormBuilder, provideAnimations()],
      imports: [RegisterCredentialsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit(): void', () => {
    it('should update the value and validity of the password repeat control', () => {
      const control = component.form.get('passwordRepeat')!;
      spyOn(control, 'updateValueAndValidity');

      control.setValue('1234');
      control.markAsDirty();
      component.form.patchValue({ password: '123' });

      expect(control.updateValueAndValidity).toHaveBeenCalled();
    });
  });

  describe('togglePasswordHide(MouseEvent): void', () => {
    it('should toggle the hide value for the password form field', () => {
      expect(component.hidePassword).toBeTruthy();

      component.togglePasswordHide(new MouseEvent('click'));

      expect(component.hidePassword).toBeFalsy();

      component.togglePasswordHide(new MouseEvent('click'));

      expect(component.hidePassword).toBeTruthy();
    });
  });

  describe('toggleRepeatPasswordHide(MouseEvent): void', () => {
    it('should toggle the hide value for the password repeat form field', () => {
      expect(component.hideRepeatPassword).toBeTruthy();

      component.toggleRepeatPasswordHide(new MouseEvent('click'));

      expect(component.hideRepeatPassword).toBeFalsy();

      component.toggleRepeatPasswordHide(new MouseEvent('click'));

      expect(component.hideRepeatPassword).toBeTruthy();
    });
  });

  describe('onCancelClick(): void', () => {
    it('should emit the cancel signal', () => {
      const onCancelEmitSpy = spyOn(component.onCancel, 'emit');

      component.onCancelClick();

      expect(onCancelEmitSpy).toHaveBeenCalled();
    });
  });

  describe('onNextClick(): void', () => {
    it('should emit the next signal with "true"', () => {
      const onNextEmitSpy = spyOn(component.onNext, 'emit');
      component.form.patchValue({ providePersonalDetails: true });

      component.onNextClick();

      expect(onNextEmitSpy).toHaveBeenCalledWith(true);
    });

    it('should emit the next signal with "false"', () => {
      const onNextEmitSpy = spyOn(component.onNext, 'emit');
      component.form.patchValue({ providePersonalDetails: null });

      component.onNextClick();

      expect(onNextEmitSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('getCredentials(): Credentials', () => {
    it('should return the credentials for future logins', () => {
      component.form.patchValue({
        email: 'max.mustermann@gmx.de',
        password: '1234',
      });

      expect(component.getCredentials()).toEqual({
        email: 'max.mustermann@gmx.de',
        password: '1234',
      });
    });

    it('should return the empty credentials because the inputs were null', () => {
      component.form.patchValue({
        email: null,
        password: null,
      });

      expect(component.getCredentials()).toEqual({
        email: '',
        password: '',
      });
    });
  });
});
