import { provideHttpClient } from '@angular/common/http';
import { SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { provideMarkdown } from 'ngx-markdown';
import { of } from 'rxjs';

import { NewReportComponent } from '@Components/user/new-report/new-report.component';
import { DateService } from '@Services/date.service';
import { ProjectReportService } from '@Services/project-report.service';
import { SnackbarService } from '@Services/snackbar.service';

describe('Component: NewReportComponent', () => {
  let component: NewReportComponent;
  let fixture: ComponentFixture<NewReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => {
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
        provideLuxonDateAdapter(),
        provideMarkdown({
          sanitize: SecurityContext.NONE,
        }),
        provideAnimations(),
      ],
      imports: [NewReportComponent],
    }).compileComponents();

    spyOnProperty(window.history, 'state').and.returnValue({
      sequenceNumber: 2,
    });

    fixture = TestBed.createComponent(NewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
