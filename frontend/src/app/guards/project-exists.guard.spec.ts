import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { Observable, of, take, throwError } from 'rxjs';

import { projectExistsGuard } from '@Guards/project-exists.guard';
import { NotFoundService } from '@Services/not-found.service';
import { ProjectService } from '@Services/project.service';

describe('Guard: projectExistsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => projectExistsGuard(...guardParameters));
  let projects: ProjectService;
  let notFound: NotFoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectService, provideHttpClient(), NotFoundService],
    });

    projects = TestBed.inject(ProjectService);
    notFound = TestBed.inject(NotFoundService);
  });

  it('should create', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should emit page not found and return true, since the project id is malformed', () => {
    spyOn(projects, 'read');
    spyOn(notFound, 'emitNotFound');

    const result = executeGuard({
      paramMap: {
        get: () => 'b16d42fe-60a6-WXYZ-84a3-313260320a1e',
      },
    } as any, {} as any);

    expect(notFound.emitNotFound).toHaveBeenCalled();
    expect(projects.read).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it('should return true, after successfully reading the project', (done) => {
    spyOn(projects, 'read').and.returnValue(of({}));
    spyOn(notFound, 'emitNotFound');

    const observable$ = executeGuard({
      paramMap: {
        get: () => 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
      },
    } as any, {} as any) as Observable<boolean>;

    observable$.pipe(take(1)).subscribe((result) => {
      expect(notFound.emitNotFound).not.toHaveBeenCalled();
      expect(projects.read).toHaveBeenCalledWith({
        route: ':id',
        ids: 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
      });
      expect(result).toBeTruthy();

      done();
    });
  });

  it('should emit page not found and return true, after unsuccessfully reading the project', (done) => {
    spyOn(projects, 'read').and.returnValue(throwError(() => new Error()));
    spyOn(notFound, 'emitNotFound');

    const observable$ = executeGuard({
      paramMap: {
        get: () => 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
      },
    } as any, {} as any) as Observable<boolean>;

    observable$.pipe(take(1)).subscribe((result) => {
      expect(notFound.emitNotFound).toHaveBeenCalled();
      expect(projects.read).toHaveBeenCalledWith({
        route: ':id',
        ids: 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
      });
      expect(result).toBeTruthy();

      done();
    });
  });
});
