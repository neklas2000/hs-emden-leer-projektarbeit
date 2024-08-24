import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { ProfileComponent } from '@Components/user/profile/profile.component';
import {
  Credentials,
  EditCredentialsComponent,
} from '@Components/user/profile/edit-credentials/edit-credentials.component';
import { AuthenticationService } from '@Services/authentication.service';
import { DialogService } from '@Services/dialog.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { UserService } from '@Services/user.service';
import { HttpException } from '@Utils/http-exception';

describe('Component: ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let dialog: DialogService;
  let snackbar: SnackbarService;
  let users: UserService;
  let auth: AuthenticationService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              profile: {
                id: '1',
                academicTitle: null,
                firstName: 'Max',
                lastName: 'Mustermann',
                email: 'max.mustermann@gmx.de',
                phoneNumber: null,
                matriculationNumber: 1234567,
              },
            }),
          },
        },
        DialogService,
        SnackbarService,
        UserService,
        AuthenticationService,
        provideHttpClient(),
        Router,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    dialog = TestBed.inject(DialogService);
    snackbar = TestBed.inject(SnackbarService);
    users = TestBed.inject(UserService);
    auth = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('editPersonalInformation(): void', () => {
    it('should set the flag editingPersonalInformation from false to true', () => {
      expect(component.isEditingPersonalInformationActivated).toBeFalsy();

      component.editPersonalInformation();

      expect(component.isEditingPersonalInformationActivated).toBeTruthy();
    });
  });

  describe('cancelEditPersonalInformation(): void', () => {
    it('should set the flag editingPersonalInformation from true to false', () => {
      component.editPersonalInformation();
      expect(component.isEditingPersonalInformationActivated).toBeTruthy();

      component.cancelEditPersonalInformation();

      expect(component.isEditingPersonalInformationActivated).toBeFalsy();
    });
  });

  describe('saveEditedPersonalInformation(DeepPartial<User>): void', () => {
    it('should apply the already saved changes to the profile', () => {
      expect(component.profile).toEqual({
        id: '1',
        academicTitle: null,
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max.mustermann@gmx.de',
        phoneNumber: null,
        matriculationNumber: 1234567,
      });

      component.saveEditedPersonalInformation({
        academicTitle: 'B. Sc.',
        phoneNumber: '+49 1234 1234567890',
      });

      expect(component.profile).toEqual({
        id: '1',
        academicTitle: 'B. Sc.',
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max.mustermann@gmx.de',
        phoneNumber: '+49 1234 1234567890',
        matriculationNumber: 1234567,
      });
    });
  });

  describe('editEmail(): void', () => {
    it('should open a dialog to edit the email address and return no changes', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(null) } as any);

      expect(component.profile).toEqual({
        id: '1',
        academicTitle: null,
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max.mustermann@gmx.de',
        phoneNumber: null,
        matriculationNumber: 1234567,
      });

      component.editEmail();

      expect(dialog.open).toHaveBeenCalledWith(EditCredentialsComponent, {
        data: {
          type: Credentials.EMAIL,
          userId: '1',
        },
      });
      expect(component.profile).toEqual({
        id: '1',
        academicTitle: null,
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max.mustermann@gmx.de',
        phoneNumber: null,
        matriculationNumber: 1234567,
      });
    });

    it('should open a dialog to edit the email address and return a changed email', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of('max.mustermann@gmail.com') } as any);

      expect(component.profile).toEqual({
        id: '1',
        academicTitle: null,
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max.mustermann@gmx.de',
        phoneNumber: null,
        matriculationNumber: 1234567,
      });

      component.editEmail();

      expect(dialog.open).toHaveBeenCalledWith(EditCredentialsComponent, {
        data: {
          type: Credentials.EMAIL,
          userId: '1',
        },
      });
      expect(component.profile).toEqual({
        id: '1',
        academicTitle: null,
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max.mustermann@gmail.com',
        phoneNumber: null,
        matriculationNumber: 1234567,
      });
    });
  });

  describe('editPassword(): void', () => {
    it('should open a dialog to edit the password handle changes internally', () => {
      spyOn(dialog, 'open');

      component.editPassword();

      expect(dialog.open).toHaveBeenCalledWith(EditCredentialsComponent, {
        data: {
          type: Credentials.PASSWORD,
          userId: '1',
        },
      });
    });
  });

  describe('deleteProfile(): void', () => {
    it('should open a dialog to verify the deletion of the profile and cancel the deletion operation', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(false) } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(users, 'delete');

      component.deleteProfile();

      expect(dialog.open).toHaveBeenCalled();
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.DELETE_OPERATION_CANCELED);
      expect(users.delete).not.toHaveBeenCalled();
    });

    it('should allow the deletion of the profile, but it fails with an exception', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showException');
      const exception = new HttpException({ error: { code: 'HSEL-400-012' }});
      spyOn(users, 'delete').and.returnValue(throwError(() => exception));
      spyOn(auth, 'clear');

      component.deleteProfile();

      expect(dialog.open).toHaveBeenCalled();
      expect(users.delete).toHaveBeenCalled();
      expect(auth.clear).not.toHaveBeenCalled();
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.DELETE_OPERATION_FAILED,
        exception,
      );
    });

    it('should allow the deletion of the profile, but it fails to confirm the deletion', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showWarning');
      spyOn(users, 'delete').and.returnValue(of(false));
      spyOn(auth, 'clear');

      component.deleteProfile();

      expect(dialog.open).toHaveBeenCalled();
      expect(users.delete).toHaveBeenCalled();
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.DELETE_OPERATION_FAILED_CONFIRMATION,
      );
      expect(auth.clear).not.toHaveBeenCalled();
    });

    it('should allow the deletion of the profile and successfully delete it', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(users, 'delete').and.returnValue(of(true));
      spyOn(auth, 'clear');
      spyOn(router, 'navigateByUrl');

      component.deleteProfile();

      expect(dialog.open).toHaveBeenCalled();
      expect(users.delete).toHaveBeenCalled();
      expect(auth.clear).toHaveBeenCalled();
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.DELETE_OPERATION_SUCCEEDED);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    });
  });
});
