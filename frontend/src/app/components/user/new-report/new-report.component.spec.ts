import { provideHttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { provideMarkdown } from 'ngx-markdown';
import { of, throwError } from 'rxjs';

import { MarkdownEditorComponent } from '@Components/markdown-editor/markdown-editor.component';
import { NewReportComponent } from '@Components/user/new-report/new-report.component';
import { DateService } from '@Services/date.service';
import { ProjectReportService } from '@Services/project-report.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { WindowProviderService } from '@Services/window-provider.service';
import { HttpException } from '@Utils/http-exception';

describe('Component: NewReportComponent', () => {
  let component: NewReportComponent;
  let fixture: ComponentFixture<NewReportComponent>;
  let projectReports: ProjectReportService;
  let router: Router;
  let snackbar: SnackbarService;
  let historyBackSpy: jasmine.Spy<jasmine.Func>;

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
    historyBackSpy = jasmine.createSpy();

    TestBed.overrideComponent(NewReportComponent, {
      add: {
        imports: [MarkdownEditorComponentStub],
      },
      remove: {
        imports: [MarkdownEditorComponent],
      },
    });
    await TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: () => {
                return '1';
              },
            }),
          },
        },
        Router,
        ProjectReportService,
        provideHttpClient(),
        DateService,
        SnackbarService,
        {
          provide: WindowProviderService,
          useValue: {
            getWindow: () => ({
              history: {
                state: {
                  sequenceNumber: 2,
                },
                back: historyBackSpy,
              },
            }),
          },
        },
        provideLuxonDateAdapter(),
        provideMarkdown(),
        provideAnimations(),
      ],
      imports: [NewReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewReportComponent);
    projectReports = TestBed.inject(ProjectReportService);
    router = TestBed.inject(Router);
    snackbar = TestBed.inject(SnackbarService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onCancelClick(): void', () => {
    it('should go one page back in the windows history', () => {
      component.onCancelClick();

      expect(historyBackSpy).toHaveBeenCalled();
    });
  });

  describe('onSaveClick(): void', () => {
    let changes: any;

    beforeEach(() => {
      changes = {
        sequenceNumber: 2,
        reportDate: '2024-01-01',
        deliverables: 'These are some deliverables',
        hazards: 'These are some hazards',
        objectives: 'These are some objectives',
        other: '',
        project: {
          id: '1',
        },
      };

      component.form.patchValue({
        sequenceNumber: 2,
        reportDate: '2024-01-01',
      });
      component.deliverables = 'These are some deliverables';
      component.hazards = 'These are some hazards';
      component.objectives = 'These are some objectives';
    });

    it('should fail to create the project report, due to an error', () => {
      component['projectId'] = null;
      delete changes.project;
      const exception = new HttpException({ error: { code: 'HSEL-400-010' }});
      spyOn(projectReports, 'create').and.returnValue(throwError(() => exception));
      spyOn(router, 'navigateByUrl');
      spyOn(snackbar, 'showException');

      component.onSaveClick();

      expect(projectReports.create).toHaveBeenCalledWith('', changes);
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED,
        exception,
      );
    });

    it('should successfully create the new project report and redirect to the details page', () => {
      spyOn(projectReports, 'create').and.returnValue(of({
        id: '2',
        project: {
          id: '1',
        },
      }));
      spyOn(router, 'navigateByUrl');
      spyOn(snackbar, 'showInfo');

      component.onSaveClick();

      expect(projectReports.create).toHaveBeenCalledWith('', changes);
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.SAVE_OPERATION_SUCCEEDED);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/projects/1/report/2');
    });
  });

  describe('get invalid(): boolean', () => {
    it('should return true, since the sequenceNumber is not defined', () => {
      component.form.patchValue({
        sequenceNumber: null,
      });

      expect(component.invalid).toBeTruthy();
    });

    it('should return true, since the reportDate is not defined', () => {
      component.form.patchValue({
        sequenceNumber: 2,
        reportDate: null,
      });

      expect(component.invalid).toBeTruthy();
    });

    it('should return true, since the deliverables are not defined', () => {
      component.form.patchValue({
        sequenceNumber: 2,
        reportDate: '2024-01-01',
      });
      component.deliverables = '';

      expect(component.invalid).toBeTruthy();
    });

    it('should return true, since the hazards are not defined', () => {
      component.form.patchValue({
        sequenceNumber: 2,
        reportDate: '2024-01-01',
      });
      component.deliverables = 'These are some deliverables';
      component.hazards = '';

      expect(component.invalid).toBeTruthy();
    });

    it('should return true, since the objectives are not defined', () => {
      component.form.patchValue({
        sequenceNumber: 2,
        reportDate: '2024-01-01',
      });
      component.deliverables = 'These are some deliverables';
      component.hazards = 'These are some hazards';
      component.objectives = '';

      expect(component.invalid).toBeTruthy();
    });

    it('should return false, since everything is defined', () => {
      component.form.patchValue({
        sequenceNumber: 2,
        reportDate: '2024-01-01',
      });
      component.deliverables = 'These are some deliverables';
      component.hazards = 'These are some hazards';
      component.objectives = 'These are some objectives';

      expect(component.invalid).toBeFalsy();
    });
  });
});
