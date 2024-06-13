import { provideHttpClient } from '@angular/common/http';
import { SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { provideMarkdown } from 'ngx-markdown';
import { of } from 'rxjs';

import { NewReportComponent } from './new-report.component';
import { ProjectReportService } from '@Services/project-report.service';
import { DateService } from '@Services/date.service';
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
        {
          provide: Window,
          useValue: {
            history: {
              state: {
                sequenceNumber: 2,
              },
            },
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

    fixture = TestBed.createComponent(NewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
