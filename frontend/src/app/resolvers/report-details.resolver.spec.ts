import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { reportDetailsResolver } from './report-details.resolver';
import { ProjectReport } from '@Models/project-report';
import { ProjectReportService } from '@Services/project-report.service';
import { Nullable } from '@Types';

describe('Resolver: reportDetailsResolver', () => {
  const executeResolver: ResolveFn<Nullable<Observable<Nullable<ProjectReport>>>> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => reportDetailsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectReportService],
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
