import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideMarkdown } from 'ngx-markdown';
import { of } from 'rxjs';

import { ReportDetailsComponent } from '@Components/user/report-details/report-details.component';
import { AgChartService } from '@Services/ag-chart.service';
import { PdfService } from '@Services/pdf.service';
import { ProjectService } from '@Services/project.service';
import { SnackbarService } from '@Services/snackbar.service';

describe('Component: ReportDetailsComponent', () => {
  let component: ReportDetailsComponent;
  let fixture: ComponentFixture<ReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDetailsComponent],
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
        AgChartService,
        PdfService,
        ProjectService,
        provideHttpClient(),
        SnackbarService,
        provideMarkdown(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
