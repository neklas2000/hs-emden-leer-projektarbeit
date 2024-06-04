import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { EditReportComponent } from './edit-report.component';
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
              report: null,
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
