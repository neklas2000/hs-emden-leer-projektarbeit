import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable, of, take, throwError } from 'rxjs';

import { ProjectReport } from '@Models/project-report';
import { reportDetailsResolver } from '@Resolvers/report-details.resolver';
import { NotFoundService } from '@Services/not-found.service';
import { ProjectReportService } from '@Services/project-report.service';
import { Nullable } from '@Types';

describe('Resolver: reportDetailsResolver', () => {
  const executeResolver: ResolveFn<Nullable<Observable<Nullable<ProjectReport>>>> =
    (...resolverParameters) => TestBed.runInInjectionContext(
      () => reportDetailsResolver(...resolverParameters),
    );
  let projectReport: ProjectReportService;
  let notFound: NotFoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectReportService, NotFoundService, provideHttpClient()],
    });

    projectReport = TestBed.inject(ProjectReportService);
    notFound = TestBed.inject(NotFoundService);
  });

  it('should create', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should return null and emit page not found, since the projectId is malformed', () => {
    spyOn(notFound, 'emitNotFound');
    spyOn(projectReport, 'read');

    const result = executeResolver({
      paramMap: {
        get: (key: string) => {
          return {
            projectId: 'b014ad2a-e9a3-WXYZ-9471-2f49d8833c9e',
            reportId: 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
          }[key];
        },
      },
    } as any, {} as any) as Nullable<Observable<Nullable<ProjectReport>>>;

    expect(notFound.emitNotFound).toHaveBeenCalled();
    expect(projectReport.read).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should return null and emit page not found, since the reportId is malformed', () => {
    spyOn(notFound, 'emitNotFound');
    spyOn(projectReport, 'read');

    const result = executeResolver({
      paramMap: {
        get: (key: string) => {
          return {
            projectId: 'b014ad2a-e9a3-43d4-9471-2f49d8833c9e',
            reportId: 'b16d42fe-60a6-WXYZ-84a3-313260320a1e',
          }[key];
        },
      },
    } as any, {} as any) as Nullable<Observable<Nullable<ProjectReport>>>;

    expect(notFound.emitNotFound).toHaveBeenCalled();
    expect(projectReport.read).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should return the project report', (done) => {
    spyOn(projectReport, 'read').and.returnValue(of({
      id: '12',
    }));
    spyOn(notFound, 'emitNotFound');

    const observable$ = executeResolver({
      paramMap: {
        get: (key: string) => {
          return {
            projectId: 'b014ad2a-e9a3-43d4-9471-2f49d8833c9e',
            reportId: 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
          }[key];
        },
      },
    } as any, {} as any) as Observable<Nullable<ProjectReport>>;

    observable$.pipe(take(1)).subscribe((result) => {
      expect(projectReport.read).toHaveBeenCalledWith({
        route: ':id',
        ids: 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
        query: {
          filters: {
            'project.id': 'b014ad2a-e9a3-43d4-9471-2f49d8833c9e',
          },
          includes: ['project'],
        },
      });
      expect(notFound.emitNotFound).not.toHaveBeenCalled();
      expect(result).toEqual({
        id: '12',
      } as any);

      done();
    });
  });

  it('should return null and emit page not found, since no project report has been found', (done) => {
    spyOn(projectReport, 'read').and.returnValue(throwError(() => new Error('Report not found')));
    spyOn(notFound, 'emitNotFound');

    const observable$ = executeResolver({
      paramMap: {
        get: (key: string) => {
          return {
            projectId: 'b014ad2a-e9a3-43d4-9471-2f49d8833c9e',
            reportId: 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
          }[key];
        },
      },
    } as any, {} as any) as Observable<Nullable<ProjectReport>>;

    observable$.pipe(take(1)).subscribe((result) => {
      expect(projectReport.read).toHaveBeenCalledWith({
        route: ':id',
        ids: 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
        query: {
          filters: {
            'project.id': 'b014ad2a-e9a3-43d4-9471-2f49d8833c9e',
          },
          includes: ['project'],
        },
      });
      expect(notFound.emitNotFound).toHaveBeenCalled();
      expect(result).toBeNull();

      done();
    });
  });
});
