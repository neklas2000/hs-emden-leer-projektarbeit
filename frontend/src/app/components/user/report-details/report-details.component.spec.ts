import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { provideMarkdown } from 'ngx-markdown';
import { of } from 'rxjs';

import { ReportDetailsComponent } from './report-details.component';

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
              report: null,
            }),
          },
        },
        provideMarkdown(),
        provideHttpClient(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
