import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable, of, take, throwError } from 'rxjs';

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
  let projectReports: ProjectReportService;
  let notFound: NotFoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectReportService, NotFoundService, provideHttpClient()],
    });

    projectReports = TestBed.inject(ProjectReportService);
    notFound = TestBed.inject(NotFoundService);
  });

  it('should create', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should return null, since the projectId is not available', (done) => {
    spyOn(projectReports, 'read');
    const observable$ = executeResolver({
      paramMap: {
        has: () => false,
      },
    } as any, {} as any) as Observable<Nullable<ProjectReport>>;

    observable$.pipe(take(1)).subscribe((result) => {
      expect(projectReports.read).not.toHaveBeenCalled();
      expect(result).toBeNull();

      done();
    });
  });

  it('should return null, since the reportId is not available', (done) => {
    spyOn(projectReports, 'read');
    const observable$ = executeResolver({
      paramMap: {
        has: (key: string) => {
          return {
            projectId: true,
            reportId: false,
          }[key];
        },
      },
    } as any, {} as any) as Observable<Nullable<ProjectReport>>;

    observable$.pipe(take(1)).subscribe((result) => {
      expect(projectReports.read).not.toHaveBeenCalled();
      expect(result).toBeNull();

      done();
    });
  });

  it('should return null and emit page not found, since the projectId is malformed', () => {
    spyOn(projectReports, 'read');
    spyOn(notFound, 'emitNotFound');
    const result = executeResolver({
      paramMap: {
        has: () => true,
        get: (key: string) => {
          return {
            projectId: 'b014ad2a-e9a3-WXYZ-9471-2f49d8833c9e',
            reportId: 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
          }[key];
        },
      },
    } as any, {} as any);

    expect(notFound.emitNotFound).toHaveBeenCalled();
    expect(projectReports.read).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should return null and emit page not found, since the reportId is malformed', () => {
    spyOn(projectReports, 'read');
    spyOn(notFound, 'emitNotFound');
    const result = executeResolver({
      paramMap: {
        has: () => true,
        get: (key: string) => {
          return {
            projectId: 'b014ad2a-e9a3-43d4-9471-2f49d8833c9e',
            reportId: 'b16d42fe-60a6-WXYZ-84a3-313260320a1e',
          }[key];
        },
      },
    } as any, {} as any);

    expect(notFound.emitNotFound).toHaveBeenCalled();
    expect(projectReports.read).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should return the project report', (done) => {
    spyOn(projectReports, 'read').and.returnValue(of({
      id: '12',
    }));
    const result$ = executeResolver({
      paramMap: {
        has: () => true,
        get: (key: string) => {
          return {
            projectId: 'b014ad2a-e9a3-43d4-9471-2f49d8833c9e',
            reportId: 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
          }[key];
        },
      },
    } as any, {} as any) as Observable<ProjectReport>;

    result$.pipe(take(1)).subscribe((report) => {
      expect(projectReports.read).toHaveBeenCalledWith({
        route: ':id',
        ids: 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
        query: {
          filters: {
            'project.id': 'b014ad2a-e9a3-43d4-9471-2f49d8833c9e',
          },
        },
      });
      expect(report).toEqual({
        id: '12',
      } as any);

      done();
    });
  });

  it('should return null and emit page not found', (done) => {
    spyOn(projectReports, 'read').and.returnValue(throwError(() => new Error('Report not found')));
    spyOn(notFound, 'emitNotFound');
    const result$ = executeResolver({
      paramMap: {
        has: () => true,
        get: (key: string) => {
          return {
            projectId: 'b014ad2a-e9a3-43d4-9471-2f49d8833c9e',
            reportId: 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
          }[key];
        },
      },
    } as any, {} as any) as Observable<Nullable<ProjectReport>>;

    result$.pipe(take(1)).subscribe((report) => {
      expect(projectReports.read).toHaveBeenCalledWith({
        route: ':id',
        ids: 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
        query: {
          filters: {
            'project.id': 'b014ad2a-e9a3-43d4-9471-2f49d8833c9e',
          },
        },
      });
      expect(notFound.emitNotFound).toHaveBeenCalled();
      expect(report).toBeNull();

      done();
    });
  });
});
