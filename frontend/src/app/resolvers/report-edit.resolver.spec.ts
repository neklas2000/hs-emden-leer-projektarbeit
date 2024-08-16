import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { ProjectReport } from '@Models/project-report';
import { reportEditResolver } from '@Resolvers/report-edit.resolver';
import { NotFoundService } from '@Services/not-found.service';
import { ProjectReportService } from '@Services/project-report.service';
import { Nullable } from '@Types';

describe('Resolver: reportEditResolver', () => {
  const executeResolver: ResolveFn<Nullable<Observable<Nullable<ProjectReport>>>> =
    (...resolverParameters) => TestBed.runInInjectionContext(
      () => reportEditResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectReportService, NotFoundService],
    });
  });

  it('should create', () => {
    expect(executeResolver).toBeTruthy();
  });
});
