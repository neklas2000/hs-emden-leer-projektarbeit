import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { LoginComponent } from '@Components/auth/login/login.component';
import { AuthenticationService } from '@Services/authentication.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { HttpException } from '@Utils/http-exception';

describe('Component: LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let auth: AuthenticationService;
  let snackbar: SnackbarService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        FormBuilder,
        AuthenticationService,
        provideHttpClient(),
        provideRouter([]),
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    auth = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    snackbar = TestBed.inject(SnackbarService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('login(): void', () => {
    it('should login the user and redirect to the homepage', () => {
      spyOn(auth, 'login').and.returnValue(of(true));
      const snackbarShowInfoSpy = spyOn(snackbar, 'showInfo');
      const routerNavigateByUrlSpy = spyOn(router, 'navigateByUrl');
      component.formGroup.patchValue({
        email: 'max.mustermann@gmx.de',
        password: '1234',
      });

      component.login();

      expect(auth.login).toHaveBeenCalledWith('max.mustermann@gmx.de', '1234');
      expect(snackbarShowInfoSpy).toHaveBeenCalledWith(SnackbarMessage.LOGIN_SUCCEEDED);
      expect(routerNavigateByUrlSpy).toHaveBeenCalledWith('/');
    });

    it('should throw an exception caused by incorrect credentials', () => {
      const exception = new HttpException({ code: 'HSEL-400-001' });
      spyOn(auth, 'login').and.returnValue(throwError(() => exception));
      const snackbarShowExceptionSpy = spyOn(snackbar, 'showException');
      component.formGroup.patchValue({
        email: 'max.mustermann@gmx.de',
        password: 'incorrect password',
      });

      component.login();

      expect(auth.login).toHaveBeenCalledWith('max.mustermann@gmx.de', 'incorrect password');
      expect(snackbarShowExceptionSpy).toHaveBeenCalledWith(
        SnackbarMessage.INCORRECT_CREDENTIALS,
        exception,
      );
    });
  });

  describe('toggleHide(MouseEvent): void', () => {
    it('should toggle the password hide', () => {
      expect(component.hide).toBeTruthy();

      component.toggleHide(new MouseEvent('click'));

      expect(component.hide).toBeFalsy();
    });
  });

  describe('get email(): string', () => {
    it('should return the email address from the form field', () => {
      component.formGroup.patchValue({ email: 'max.mustermann@gmx.de' });

      expect(component.email).toEqual('max.mustermann@gmx.de');
    });

    it('should return an empty string for the email address from the form field', () => {
      component.formGroup.patchValue({ email: null });

      expect(component.email).toEqual('');
    });
  });

  describe('get password(): string', () => {
    it('should return the password from the form field', () => {
      component.formGroup.patchValue({ password: '1234' });

      expect(component.password).toEqual('1234');
    });

    it('should return an empty string for the password from the form field', () => {
      component.formGroup.patchValue({ password: null });

      expect(component.password).toEqual('');
    });
  });
});
