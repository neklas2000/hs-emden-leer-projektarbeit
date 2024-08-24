import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { EditProjectComponent } from '@Components/user/edit-project/edit-project.component';
import { ProjectService } from '@Services/project.service';
import { FormBuilder } from '@angular/forms';
import { DateService } from '@Services/date.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { WindowProviderService } from '@Services/window-provider.service';
import { DateTime } from 'luxon';
import { HttpException } from '@Utils/http-exception';

describe('Component: EditProjectComponent', () => {
  let component: EditProjectComponent;
  let fixture: ComponentFixture<EditProjectComponent>;
  let route: ActivatedRoute;
  let snackbar: SnackbarService;
  let projects: ProjectService;
  let router: Router;
  let historyBackSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    historyBackSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [EditProjectComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              project: {
                id: '12',
                name: 'Test',
                reportInterval: 7,
                officialStart: '2024-01-01',
                officialEnd: '2024-01-29',
                type: 'Softwareproject',
              },
            }),
          },
        },
        FormBuilder,
        DateService,
        SnackbarService,
        ProjectService,
        provideHttpClient(),
        Router,
        {
          provide: WindowProviderService,
          useValue: {
            getWindow: () => ({
              history: {
                back: historyBackSpy,
              },
            }),
          },
        },
        provideLuxonDateAdapter(),
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProjectComponent);
    route = TestBed.inject(ActivatedRoute);
    snackbar = TestBed.inject(SnackbarService);
    projects = TestBed.inject(ProjectService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.form.controls['endDate'].value).toEqual(DateTime.fromSQL('2024-01-29'));
    expect(component.form.controls['type'].value).toEqual('Softwareproject');
  });

  describe('ngOnInit(): void', () => {
    it('should patch the values of the form with the fallback values', () => {
      route.data = of({
        project: {
          id: '12',
          name: 'Test',
          reportInterval: 7,
          officialStart: '2024-01-01',
          officialEnd: null,
          type: null,
        },
      });

      component.ngOnInit();

      expect(component.form.controls['endDate'].value).toEqual('');
      expect(component.form.controls['type'].value).toEqual('');
    });

    it('should update the value and validity of the endDate control, since the interval value has changed', () => {
      spyOn(component.form.controls['endDate'], 'updateValueAndValidity');

      component.form.controls['endDate'].markAsDirty();
      component.form.patchValue({ interval: 5 });

      expect(component.form.controls['endDate'].updateValueAndValidity).toHaveBeenCalled();
    });

    it('should update the value and validity of the endDate control, since the startDate value has changed', () => {
      spyOn(component.form.controls['endDate'], 'updateValueAndValidity');

      component.form.controls['endDate'].markAsDirty();
      component.form.patchValue({ startDate: DateTime.fromSQL('2024-01-08') });

      expect(component.form.controls['endDate'].updateValueAndValidity).toHaveBeenCalled();
    });
  });

  describe('boundFilterEndDate(DateTime | null): boolean', () => {
    it('should return false because null was given', () => {
      expect(component.boundFilterEndDate(null)).toBeFalsy();
    });

    it('should return false, since the given date is before the start date', () => {
      expect(component.boundFilterEndDate(DateTime.fromSQL('2023-12-25'))).toBeFalsy();
    });

    it('should return true, since the given date is within the interval', () => {
      expect(component.boundFilterEndDate(DateTime.fromSQL('2024-01-15'))).toBeTruthy();
    });

    it('should return true, since the given date is within the interval (interval is set to 1)', () => {
      component.form.patchValue({ interval: null });

      expect(component.boundFilterEndDate(DateTime.fromSQL('2024-01-15'))).toBeTruthy();
    });
  });

  describe('onCancelClick(): void', () => {
    it('should go one back in the windows history', () => {
      component.onCancelClick();

      expect(historyBackSpy).toHaveBeenCalled();
    });
  });

  describe('onSubmitClick(): void', () => {
    it('should update the project and fail due to an exception', () => {
      const exception = new HttpException({ error: { code: 'HSEL-400-069' }});
      spyOn(projects, 'update').and.returnValue(throwError(() => exception));
      spyOn(snackbar, 'showException');
      spyOn(router, 'navigateByUrl');

      component.onSubmitClick();

      expect(projects.update).toHaveBeenCalledWith(':id', '12', {
        name: 'Test',
        reportInterval: 7,
        officialStart: '2024-01-01',
        officialEnd: '2024-01-29',
        type: 'Softwareproject',
      });
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED,
        exception,
      );
    });

    it('should update the project and fail due to an exception', () => {
      spyOn(projects, 'update').and.returnValue(of(false));
      spyOn(snackbar, 'showWarning');
      spyOn(router, 'navigateByUrl');
      component.form.patchValue({
        endDate: null,
        type: null,
      });

      component.onSubmitClick();

      expect(projects.update).toHaveBeenCalledWith(':id', '12', {
        name: 'Test',
        reportInterval: 7,
        officialStart: '2024-01-01',
        officialEnd: null,
        type: null,
      });
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED_CONFIRMATION,
      );
    });

    it('should successfully update the project and redirect to the details page', () => {
      spyOn(projects, 'update').and.returnValue(of(true));
      spyOn(snackbar, 'showInfo');
      spyOn(router, 'navigateByUrl');

      component.onSubmitClick();

      expect(projects.update).toHaveBeenCalledWith(':id', '12', {
        name: 'Test',
        reportInterval: 7,
        officialStart: '2024-01-01',
        officialEnd: '2024-01-29',
        type: 'Softwareproject',
      });
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.SAVE_OPERATION_SUCCEEDED);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/projects/12');
    });
  });
});
