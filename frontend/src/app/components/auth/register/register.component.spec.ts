import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { RegisterComponent } from '@Components/auth/register/register.component';
import { AuthenticationService } from '@Services/authentication.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { HttpException } from '@Utils/http-exception';

describe('Component: RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let auth: AuthenticationService;
  let router: Router;
  let snackbar: SnackbarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        provideHttpClient(),
        provideAnimations(),
        provideRouter([]),
        SnackbarService,
      ],
      imports: [RegisterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    auth = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    snackbar = TestBed.inject(SnackbarService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('gotoFirstStep(): void', () => {
    it('should go back to the first step', () => {
      component.step = 1;

      expect(component.step).toBe(1);

      component.gotoFirstStep();

      expect(component.step).toBe(0);
    });
  });

  describe('cancel(): void', () => {
    it('should redirect to the login page', () => {
      spyOn(router, 'navigateByUrl');

      component.cancel();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/login');
    });
  });

  describe('nextStep(boolean): void', () => {
    it('should change to step 1', () => {
      expect(component.step).toBe(0);

      component.nextStep(true);

      expect(component.step).toBe(1);
    });

    it('should not change the step and register the user without personal details', () => {
      spyOn(component, 'registerUser');

      expect(component.step).toBe(0);

      component.nextStep(false);

      expect(component.registerUser).toHaveBeenCalledWith(false);
      expect(component.step).toBe(0);
    });
  });

  describe('registerUser(boolean): void', () => {
    it('should successfully register an user without personal details', fakeAsync(() => {
      spyOn(component.provideCredentials, 'getCredentials').and.returnValue({
        password: 'secure password',
        email: 'max.mustermann@gmx.de',
      });
      spyOn(component.providePersonalDetails, 'getPersonalDetails');
      spyOn(auth, 'register').and.returnValue(of(true));
      spyOn(router, 'navigateByUrl').and.resolveTo();
      spyOn(snackbar, 'showInfo');

      expect(component.step).toBe(0);

      component.registerUser(false);
      tick(2001);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(component.providePersonalDetails.getPersonalDetails).not.toHaveBeenCalled();
        expect(auth.register).toHaveBeenCalledWith({
          password: 'secure password',
          email: 'max.mustermann@gmx.de',
        });
        expect(component.step).toBe(2);
        expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.REGISTER_SUCCEEDED);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/');
      });
    }));

    it('should fail to register an user with his personal details', () => {
      spyOn(component.provideCredentials, 'getCredentials').and.returnValue({
        password: 'secure password',
        email: 'max.mustermann@gmx.de',
      });
      spyOn(component.providePersonalDetails, 'getPersonalDetails').and.returnValue({
        academicTitle: null,
        firstName: 'Max',
        lastName: 'Mustermann',
        matriculationNumber: 1234567,
        phoneNumber: null,
      });
      const exception = new HttpException({ code: 'HSEL-400-001' });
      spyOn(auth, 'register').and.returnValue(throwError(() => exception));
      spyOn(snackbar, 'showException');
      spyOn(snackbar, 'showInfo');

      component.registerUser(true);

      expect(component.providePersonalDetails.getPersonalDetails).toHaveBeenCalled();
      expect(auth.register).toHaveBeenCalledWith({
        password: 'secure password',
        email: 'max.mustermann@gmx.de',
        academicTitle: null,
        firstName: 'Max',
        lastName: 'Mustermann',
        matriculationNumber: 1234567,
        phoneNumber: null,
      });
      expect(snackbar.showInfo).not.toHaveBeenCalled();
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.REGISTER_FAILED,
        exception,
      );
    });
  });
});
