import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { provideMarkdown } from 'ngx-markdown';
import { of } from 'rxjs';

import { EditReportComponent } from '@Components/user/edit-report/edit-report.component';
import { ProjectReportService } from '@Services/project-report.service';
import { SnackbarService } from '@Services/snackbar.service';

describe('Component: EditReportComponent', () => {
  let component: EditReportComponent;
  let fixture: ComponentFixture<EditReportComponent>;
  let spyNavigateByUrl: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    spyNavigateByUrl = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [EditReportComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              report: {
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
        {
          provide: Router,
          useValue: {
            navigateByUrl: spyNavigateByUrl,
          },
        },
        ProjectReportService,
        provideHttpClient(),
        SnackbarService,
        provideMarkdown(),
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
