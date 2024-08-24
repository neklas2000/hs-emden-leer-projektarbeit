import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  EditPersonalInformationComponent
} from '@Components/user/profile/edit-personal-information/edit-personal-information.component';
import { ProfileService } from '@Services/profile.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { HttpException } from '@Utils/http-exception';
import { of, throwError } from 'rxjs';

describe('Component: EditPersonalInformationComponent', () => {
  let component: EditPersonalInformationComponent;
  let fixture: ComponentFixture<EditPersonalInformationComponent>;
  let profile: ProfileService;
  let snackbar: SnackbarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        ProfileService,
        provideHttpClient(),
        SnackbarService,
        provideAnimations(),
      ],
      imports: [EditPersonalInformationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPersonalInformationComponent);
    profile = TestBed.inject(ProfileService);
    snackbar = TestBed.inject(SnackbarService);
    component = fixture.componentInstance;
    component.profile = {
      id: '1',
      academicTitle: 'B. Sc.',
      firstName: 'Max',
      lastName: 'Mustermann',
      matriculationNumber: 1234567,
      phoneNumber: '+49 1234 1234567890',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit(): void', () => {
    it('should use the fallback values', () => {
      component.profile = {
        id: '1',
        academicTitle: null,
        firstName: null,
        lastName: null,
        matriculationNumber: null,
        phoneNumber: null,
      };

      component.ngOnInit();

      expect(component.form.getRawValue()).toEqual({
        academicTitle: null,
        firstName: '',
        lastName: '',
        matriculationNumber: null,
        phoneNumber: null,
      });
    });
  });

  describe('saveChanges(): void', () => {
    it('should not update the profile due to an exception', () => {
      spyOn(component.onCancel, 'emit');
      spyOn(snackbar, 'showException');
      const exception = new HttpException({ error: { code: 'HSEL-400-123' }});
      spyOn(profile, 'update').and.returnValue(throwError(() => exception));

      component.saveChanges();

      expect(profile.update).toHaveBeenCalledWith(':id', '1', {
        academicTitle: 'B. Sc.',
        firstName: 'Max',
        lastName: 'Mustermann',
        matriculationNumber: 1234567,
        phoneNumber: '+49 1234 1234567890',
      });
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED,
        exception,
      );
      expect(component.onCancel.emit).toHaveBeenCalled();
    });

    it('should fail to confirm the success of the update and use the fallback values', () => {
      component.profile = {
        id: '1',
        academicTitle: null,
        firstName: 'Max',
        lastName: 'Mustermann',
        matriculationNumber: null,
        phoneNumber: null,
      };
      component.ngOnInit();

      spyOn(component.onCancel, 'emit');
      spyOn(snackbar, 'showWarning');
      spyOn(profile, 'update').and.returnValue(of(false));

      component.saveChanges();

      expect(profile.update).toHaveBeenCalledWith(':id', '1', {
        academicTitle: null,
        firstName: 'Max',
        lastName: 'Mustermann',
        matriculationNumber: null,
        phoneNumber: null,
      });
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED_CONFIRMATION,
      );
      expect(component.onCancel.emit).toHaveBeenCalled();
    });

    it('should successfully update the personal information and send the data to the parent component', () => {
      spyOn(component.onSubmit, 'emit');
      spyOn(snackbar, 'showInfo');
      spyOn(profile, 'update').and.returnValue(of(true));

      component.saveChanges();

      expect(profile.update).toHaveBeenCalledWith(':id', '1', {
        academicTitle: 'B. Sc.',
        firstName: 'Max',
        lastName: 'Mustermann',
        matriculationNumber: 1234567,
        phoneNumber: '+49 1234 1234567890',
      });
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.SAVE_OPERATION_SUCCEEDED);
      expect(component.onSubmit.emit).toHaveBeenCalledWith({
        academicTitle: 'B. Sc.',
        firstName: 'Max',
        lastName: 'Mustermann',
        matriculationNumber: 1234567,
        phoneNumber: '+49 1234 1234567890',
      });
    });
  });
});
