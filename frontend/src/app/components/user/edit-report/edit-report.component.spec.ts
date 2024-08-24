import { provideHttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { provideMarkdown } from 'ngx-markdown';
import { of, throwError } from 'rxjs';

import { MarkdownEditorComponent } from '@Components/markdown-editor/markdown-editor.component';
import { EditReportComponent } from '@Components/user/edit-report/edit-report.component';
import { ProjectReportService } from '@Services/project-report.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { WindowProviderService } from '@Services/window-provider.service';
import { HttpException } from '@Utils/http-exception';

describe('Component: EditReportComponent', () => {
  let component: EditReportComponent;
  let fixture: ComponentFixture<EditReportComponent>;
  let router: Router;
  let snackbar: SnackbarService;
  let projectReports: ProjectReportService;

  @Component({
    selector: 'hsel-markdown-editor',
    standalone: true,
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: MarkdownEditorComponentStub,
      },
    ],
  })
  class MarkdownEditorComponentStub implements ControlValueAccessor {
    @Input() label: string = 'Textarea';
    @Input() required: boolean = false;
    disabled: boolean = false;
    markdown: string = '';

    onChange = (markdown: string) => { };
    onTouched = () => { };

    writeValue(markdown: string): void {
      this.markdown = markdown;
    }

    registerOnChange(fn: any): void {
      this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
      this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
      this.disabled = isDisabled;
    }
  }

  beforeEach(async () => {
    TestBed.overrideComponent(EditReportComponent, {
      add: {
        imports: [MarkdownEditorComponentStub],
      },
      remove: {
        imports: [MarkdownEditorComponent],
      },
    });
    await TestBed.configureTestingModule({
      imports: [EditReportComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              report: {
                id: '1',
                reportDate: '2024-01-01',
                sequenceNumber: 1,
                deliverables: 'Nothing has been done the past week.',
                objectives: 'We plan to accomplish more than the previous week.',
                hazards: 'The typical risk of random sickness stays.',
                other: null,
              },
            }),
          },
        },
        Router,
        ProjectReportService,
        provideHttpClient(),
        SnackbarService,
        {
          provide: WindowProviderService,
          useValue: {
            getWindow: () => ({
              location: {
                pathname: '/projects/123/report/1/edit',
              },
            }),
          },
        },
        provideMarkdown(),
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditReportComponent);
    router = TestBed.inject(Router);
    snackbar = TestBed.inject(SnackbarService);
    projectReports = TestBed.inject(ProjectReportService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('save(): void', () => {
    it('should show an error, since the patch request failed', () => {
      const exception = new HttpException({ error: { code: 'HSEL-400-008' }});
      spyOn(projectReports, 'update').and.returnValue(throwError(() => exception));
      spyOn(snackbar, 'showException');

      component.save();

      expect(projectReports.update).toHaveBeenCalledWith(':id', '1', {
        deliverables: 'Nothing has been done the past week.',
        objectives: 'We plan to accomplish more than the previous week.',
        hazards: 'The typical risk of random sickness stays.',
        other: '',
      });
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED,
        exception,
      );
    });

    it('should show a warning, since the patch request failed to confirm that the save has been successful (due to sql)', () => {
      spyOn(projectReports, 'update').and.returnValue(of(false));
      spyOn(snackbar, 'showWarning');

      component.save();

      expect(projectReports.update).toHaveBeenCalledWith(':id', '1', {
        deliverables: 'Nothing has been done the past week.',
        objectives: 'We plan to accomplish more than the previous week.',
        hazards: 'The typical risk of random sickness stays.',
        other: '',
      });
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED_CONFIRMATION,
      );
    });

    it('should successfully update the project report and after redirecting the user it should show an info snack-bar', fakeAsync(() => {
      spyOn(projectReports, 'update').and.returnValue(of(true));
      spyOn(snackbar, 'showInfo');
      spyOn(component, 'back').and.resolveTo(true);

      component.save();
      tick();

      expect(projectReports.update).toHaveBeenCalledWith(':id', '1', {
        deliverables: 'Nothing has been done the past week.',
        objectives: 'We plan to accomplish more than the previous week.',
        hazards: 'The typical risk of random sickness stays.',
        other: '',
      });
      expect(component.back).toHaveBeenCalled();
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.SAVE_OPERATION_SUCCEEDED);
    }));
  });

  describe('cancel(): void', () => {
    it('should call back and navigate to the details page of the project report', fakeAsync(() => {
      spyOn(router, 'navigateByUrl').and.resolveTo(true);

      component.cancel();
      tick();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/projects/123/report/1');
    }));
  });

  describe('back(): Promise<boolean>', () => {
    it('should navigate back to the details page of that project report', (done) => {
      spyOn(router, 'navigateByUrl').and.resolveTo(true);

      component.back().then(() => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('/projects/123/report/1');

        done();
      });
    });
  });
});
