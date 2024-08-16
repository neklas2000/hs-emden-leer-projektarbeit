import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { ProjectReport } from '@Models/project-report';
import { reportDetailsResolver } from '@Resolvers/report-details.resolver';
import { ProjectReportService } from '@Services/project-report.service';
import { Nullable } from '@Types';

describe('Resolver: reportDetailsResolver', () => {
  const executeResolver: ResolveFn<Nullable<Observable<Nullable<ProjectReport>>>> =
    (...resolverParameters) => TestBed.runInInjectionContext(
      () => reportDetailsResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectReportService],
    });
  });

  it('should create', () => {
    expect(executeResolver).toBeTruthy();
  });
});
