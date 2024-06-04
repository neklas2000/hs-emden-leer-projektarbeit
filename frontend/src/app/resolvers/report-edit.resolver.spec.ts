import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { ProjectReport } from '@Models/project-report';
import { reportEditResolver } from './report-edit.resolver';
import { ProjectReportService } from '@Services/project-report.service';
import { Nullable } from '@Types';

describe('Resolver: reportEditResolver', () => {
  const executeResolver: ResolveFn<Observable<Nullable<ProjectReport>>> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => reportEditResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectReportService],
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
