import { provideHttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  Credentials,
  EditCredentialsComponent
} from '@Components/user/profile/edit-credentials/edit-credentials.component';
import { ProfileService } from '@Services/profile.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { Helper } from '@Test/helper';
import { HttpException } from '@Utils/http-exception';
import { of, throwError } from 'rxjs';

describe('Component: EditCredentialsComponent', () => {
  let component: EditCredentialsComponent;
  let fixture: ComponentFixture<EditCredentialsComponent>;
  let profile: ProfileService;
  let snackbar: SnackbarService;
  let backdropClickEvent: EventEmitter<MouseEvent>;
  let dialogCloseSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(() => {
    backdropClickEvent = new EventEmitter();
    dialogCloseSpy = jasmine.createSpy();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            backdropClick: () => backdropClickEvent.asObservable(),
            close: dialogCloseSpy,
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            type: Credentials.EMAIL,
            userId: '1',
          },
        },
        FormBuilder,
        ProfileService,
        provideHttpClient(),
        SnackbarService,
        provideAnimations(),
      ],
      imports: [EditCredentialsComponent],
    });
  });

  async function injectDependencies() {
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(EditCredentialsComponent);
    profile = TestBed.inject(ProfileService);
    snackbar = TestBed.inject(SnackbarService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    backdropClickEvent.complete();
  });

  it('should create with an email form', async () => {
    await injectDependencies();

    expect(component).toBeTruthy();
    expect(Object.keys(component.form.controls)).toContain('newEmail');
    expect(Object.keys(component.form.controls)).not.toContain('newPassword');
  });

  it('should create with an password form', async () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, {
      useValue: {
        type: Credentials.PASSWORD,
        userId: '1',
      },
    });
    await injectDependencies();

    expect(component).toBeTruthy();
    expect(Object.keys(component.form.controls)).toContain('newPassword');
    expect(Object.keys(component.form.controls)).not.toContain('newEmail');
  });

  it('should close the dialog, because the backdrop has been clicked', async () => {
    await injectDependencies();

    backdropClickEvent.next(new MouseEvent('click'));

    expect(dialogCloseSpy).toHaveBeenCalled();
  });

  describe('onCancelClick(): void', () => {
    it('should close this dialog', async () => {
      await injectDependencies();

      component.onCancelClick();

      expect(dialogCloseSpy).toHaveBeenCalled();
    });
  });

  describe('onSubmitClick(): void', () => {
    it('should validate the given credentials (both email and password) and fail due to an exception', async () => {
      await injectDependencies();

      const exception = new HttpException({ error: { code: 'HSEL-400-051' }});
      spyOn(profile, 'validateCredentials').and.returnValue(throwError(() => exception));
      spyOn(snackbar, 'showException');
      spyOn(profile, 'update');

      component.form.patchValue({
        oldEmail: 'max.mustermann@gmx.de',
        password: 'very secure password',
      });

      component.onSubmitClick();

      expect(profile.validateCredentials).toHaveBeenCalledWith({
        userId: '1',
        email: 'max.mustermann@gmx.de',
        password: 'very secure password'
      });
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.INCORRECT_CREDENTIALS,
        exception,
      );
      expect(profile.update).not.toHaveBeenCalled();
    });

    it('should validate the given credentials but not be able to find a matching user', async () => {
      await injectDependencies();

      spyOn(profile, 'validateCredentials').and.returnValue(of(null));
      spyOn(profile, 'update');
      spyOn(snackbar, 'showError');

      component.form.patchValue({
        oldEmail: 'max.mustermann@gmx.de',
        password: 'very secure password',
        newEmail: 'max.mustermann@gmail.com',
      });

      component.onSubmitClick();
      expect(profile.validateCredentials).toHaveBeenCalledWith({
        userId: '1',
        email: 'max.mustermann@gmx.de',
        password: 'very secure password'
      });
      expect(snackbar.showError).toHaveBeenCalledWith(SnackbarMessage.INCORRECT_CREDENTIALS);
      expect(profile.update).not.toHaveBeenCalled();
    });

    it('should validate the given credentials and successfully update the email address', async () => {
      await injectDependencies();

      spyOn(profile, 'validateCredentials').and.returnValue(of({} as any));
      spyOn(profile, 'update').and.returnValue(of(true));
      spyOn(snackbar, 'showInfo');

      component.form.patchValue({
        oldEmail: 'max.mustermann@gmx.de',
        password: 'very secure password',
        newEmail: 'max.mustermann@gmail.com',
      });

      component.onSubmitClick();
      expect(profile.validateCredentials).toHaveBeenCalledWith({
        userId: '1',
        email: 'max.mustermann@gmx.de',
        password: 'very secure password'
      });
      expect(profile.update).toHaveBeenCalledWith(':id', '1', {
        email: 'max.mustermann@gmail.com',
      });
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.UPDATE_EMAIL_SUCCEEDED);
      expect(dialogCloseSpy).toHaveBeenCalledWith('max.mustermann@gmail.com');
    });

    it('should validate the given credentials and fail to confirm the update of the email address', async () => {
      await injectDependencies();

      spyOn(profile, 'validateCredentials').and.returnValue(of({} as any));
      spyOn(profile, 'update').and.returnValue(of(false));
      spyOn(snackbar, 'showWarning');

      component.form.patchValue({
        oldEmail: 'max.mustermann@gmx.de',
        password: 'very secure password',
        newEmail: 'max.mustermann@gmail.com',
      });

      component.onSubmitClick();
      expect(profile.validateCredentials).toHaveBeenCalledWith({
        userId: '1',
        email: 'max.mustermann@gmx.de',
        password: 'very secure password'
      });
      expect(profile.update).toHaveBeenCalledWith(':id', '1', {
        email: 'max.mustermann@gmail.com',
      });
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.UPDATE_EMAIL_FAILED_CONFIRMATION,
      );
      expect(dialogCloseSpy).not.toHaveBeenCalled();
    });

    it('should validate the given credentials and fail update of the email address due to an exception', async () => {
      await injectDependencies();

      const exception = new HttpException({ error: { code: 'HSEL-400-054' }});
      spyOn(profile, 'validateCredentials').and.returnValue(of({} as any));
      spyOn(profile, 'update').and.returnValue(throwError(() => exception));
      spyOn(snackbar, 'showException');

      component.form.patchValue({
        oldEmail: 'max.mustermann@gmx.de',
        password: 'very secure password',
        newEmail: 'max.mustermann@gmail.com',
      });

      component.onSubmitClick();
      expect(profile.validateCredentials).toHaveBeenCalledWith({
        userId: '1',
        email: 'max.mustermann@gmx.de',
        password: 'very secure password'
      });
      expect(profile.update).toHaveBeenCalledWith(':id', '1', {
        email: 'max.mustermann@gmail.com',
      });
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.UPDATE_EMAIL_FAILED,
        exception,
      );
      expect(dialogCloseSpy).toHaveBeenCalledWith(null);
    });

    it('should validate the given credentials (only the password) and successfully update the password', async () => {
      TestBed.overrideProvider(MAT_DIALOG_DATA, {
        useValue: {
          type: Credentials.PASSWORD,
          userId: '1',
        },
      });
      await injectDependencies();

      spyOn(profile, 'validateCredentials').and.returnValue(of({} as any));
      spyOn(profile, 'update').and.returnValue(of(true));
      spyOn(snackbar, 'showInfo');

      component.form.patchValue({
        password: 'very secure password',
        newPassword: 'new very secure password',
      });

      component.onSubmitClick();
      expect(profile.validateCredentials).toHaveBeenCalledWith({
        userId: '1',
        email: undefined,
        password: 'very secure password',
      });
      expect(profile.update).toHaveBeenCalledWith(':id', '1', {
        password: 'new very secure password',
      });
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.UPDATE_PASSWORD_SUCCEEDED);
      expect(dialogCloseSpy).toHaveBeenCalledWith(null);
    });

    it('should validate the given credentials (only the password) and fail to confirm the update of the password', async () => {
      TestBed.overrideProvider(MAT_DIALOG_DATA, {
        useValue: {
          type: Credentials.PASSWORD,
          userId: '1',
        },
      });
      await injectDependencies();

      spyOn(profile, 'validateCredentials').and.returnValue(of({} as any));
      spyOn(profile, 'update').and.returnValue(of(false));
      spyOn(snackbar, 'showWarning');

      component.form.patchValue({
        password: 'very secure password',
        newPassword: 'new very secure password',
      });

      component.onSubmitClick();
      expect(profile.validateCredentials).toHaveBeenCalledWith({
        userId: '1',
        email: undefined,
        password: 'very secure password',
      });
      expect(profile.update).toHaveBeenCalledWith(':id', '1', {
        password: 'new very secure password',
      });
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.UPDATE_PASSWORD_FAILED_CONFIRMATION,
      );
      expect(dialogCloseSpy).not.toHaveBeenCalled();
    });

    it('should validate the given credentials (only the password) and fail to update the password, due to an exception', async () => {
      TestBed.overrideProvider(MAT_DIALOG_DATA, {
        useValue: {
          type: Credentials.PASSWORD,
          userId: '1',
        },
      });
      await injectDependencies();

      spyOn(profile, 'validateCredentials').and.returnValue(of({} as any));
      const exception = new HttpException({ error: { code: 'HSEL-400-056' }});
      spyOn(profile, 'update').and.returnValue(throwError(() => exception));
      spyOn(snackbar, 'showException');

      component.form.patchValue({
        password: 'very secure password',
        newPassword: 'new very secure password',
      });

      component.onSubmitClick();
      expect(profile.validateCredentials).toHaveBeenCalledWith({
        userId: '1',
        email: undefined,
        password: 'very secure password',
      });
      expect(profile.update).toHaveBeenCalledWith(':id', '1', {
        password: 'new very secure password',
      });
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.UPDATE_PASSWORD_FAILED,
        exception,
      );
      expect(dialogCloseSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('toggleOldPasswordHide(MouseEvent): void', () => {
    it('should toggle the flag hideOldPassword for the password form', async () => {
      TestBed.overrideProvider(MAT_DIALOG_DATA, {
        useValue: {
          type: Credentials.PASSWORD,
          userId: '1',
        },
      });
      await injectDependencies();

      expect(component.hideOldPassword).toBeTruthy();
      expect(Helper.getFirstElement(fixture, 'input[type="password"][formControlName="password"]')).not.toBeNull();
      expect(Helper.getFirstElement(fixture, 'input[type="text"][formControlName="password"]')).toBeNull();

      component.toggleOldPasswordHide(new MouseEvent('click'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.hideOldPassword).toBeFalsy();
      expect(Helper.getFirstElement(fixture, 'input[type="password"][formControlName="password"]')).toBeNull();
      expect(Helper.getFirstElement(fixture, 'input[type="text"][formControlName="password"]')).not.toBeNull();
    });
  });

  describe('togglePasswordHide(MouseEvent): void', () => {
    it('should toggle the flag hidePassword for the email form', async () => {
      await injectDependencies();

      expect(component.hidePassword).toBeTruthy();
      expect(Helper.getFirstElement(fixture, 'input[type="password"]')).not.toBeNull();
      expect(Helper.getFirstElement(fixture, 'input[type="text"]')).toBeNull();

      component.togglePasswordHide(new MouseEvent('click'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.hidePassword).toBeFalsy();
      expect(Helper.getFirstElement(fixture, 'input[type="password"]')).toBeNull();
      expect(Helper.getFirstElement(fixture, 'input[type="text"]')).not.toBeNull();
    });

    it('should toggle the flag hidePassword for the password form', async () => {
      TestBed.overrideProvider(MAT_DIALOG_DATA, {
        useValue: {
          type: Credentials.PASSWORD,
          userId: '1',
        },
      });
      await injectDependencies();

      expect(component.hidePassword).toBeTruthy();
      let input = Helper.getFirstElement<HTMLInputElement>(
        fixture,
        'input[type="password"][formControlName="newPassword"]',
      );
      expect(input).not.toBeNull();
      input = Helper.getFirstElement<HTMLInputElement>(
        fixture,
        'input[type="text"][formControlName="newPassword"]',
      );
      expect(input).toBeNull();

      component.togglePasswordHide(new MouseEvent('click'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.hidePassword).toBeFalsy();
      input = Helper.getFirstElement<HTMLInputElement>(
        fixture,
        'input[type="password"][formControlName="newPassword"]',
      );
      expect(input).toBeNull();
      input = Helper.getFirstElement<HTMLInputElement>(
        fixture,
        'input[type="text"][formControlName="newPassword"]',
      );
      expect(input).not.toBeNull();
    });
  });

  describe('togglePasswordRepeatHide(MouseEvent): void', () => {
    it('should toggle the flag hidePasswordRepeat for the password form', async () => {
      TestBed.overrideProvider(MAT_DIALOG_DATA, {
        useValue: {
          type: Credentials.PASSWORD,
          userId: '1',
        },
      });
      await injectDependencies();

      expect(component.hidePasswordRepeat).toBeTruthy();
      expect(
        Helper.getFirstElement(fixture, 'input[type="password"][formControlName="newPasswordRepeat"]'),
      ).not.toBeNull();
      expect(
        Helper.getFirstElement(fixture, 'input[type="text"][formControlName="newPasswordRepeat"]'),
      ).toBeNull();

      component.togglePasswordRepeatHide(new MouseEvent('click'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.hidePasswordRepeat).toBeFalsy();
      expect(
        Helper.getFirstElement(fixture, 'input[type="password"][formControlName="newPasswordRepeat"]'),
      ).toBeNull();
      expect(
        Helper.getFirstElement(fixture, 'input[type="text"][formControlName="newPasswordRepeat"]'),
      ).not.toBeNull();
    });
  });
});
