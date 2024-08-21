import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable, of, take, throwError } from 'rxjs';

import { Project } from '@Models/project';
import { projectDetailsResolver } from '@Resolvers/project-details.resolver';
import { NotFoundService } from '@Services/not-found.service';
import { ProjectService } from '@Services/project.service';
import { Nullable } from '@Types';

describe('Resolver: projectDetailsResolver', () => {
  const executeResolver: ResolveFn<Nullable<Observable<Nullable<Project>>>> =
    (...resolverParameters) => TestBed.runInInjectionContext(
      () => projectDetailsResolver(...resolverParameters),
    );
  let project: ProjectService;
  let notFound: NotFoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectService, NotFoundService, provideHttpClient()],
    });

    project = TestBed.inject(ProjectService);
    notFound = TestBed.inject(NotFoundService);
  });

  it('should create', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should return null and emit page not found, since the project id is malformed', () => {
    spyOn(project, 'read');
    spyOn(notFound, 'emitNotFound');

    const result = executeResolver({
      paramMap: {
        get: () => 'b16d42fe-60a6-WXYZ-84a3-313260320a1e',
      },
    } as any, {} as any);

    expect(notFound.emitNotFound).toHaveBeenCalled();
    expect(project.read).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should return the project', (done) => {
    spyOn(project, 'read').and.returnValue(of({
      id: '12',
    }));
    spyOn(notFound, 'emitNotFound');

    const observable$ = executeResolver({
      paramMap: {
        get: () => 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
      },
    } as any, {} as any) as Observable<Nullable<Project>>;

    observable$.pipe(take(1)).subscribe((result) => {
      expect(notFound.emitNotFound).not.toHaveBeenCalled();
      expect(project.read).toHaveBeenCalledWith({
        route: ':id',
        ids: 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
        query: {
          includes: ['owner', 'members', 'members.user', 'reports', 'milestones', 'milestones.estimates'],
          sparseFieldsets: {
            members: ['id', 'role'],
            'members.user': ['id', 'academicTitle', 'firstName', 'lastName', 'matriculationNumber', 'email', 'phoneNumber'],
            reports: ['id', 'sequenceNumber', 'reportDate'],
            milestones: ['id', 'name', 'milestoneReached'],
          },
        },
      });
      expect(result).toEqual({
        id: '12',
      } as any);

      done();
    });
  });

  it('should return null and emit page not found, since no poject has been found', (done) => {
    spyOn(project, 'read').and.returnValue(throwError(() =>  new Error('Project not found')));
    spyOn(notFound, 'emitNotFound');

    const observable$ = executeResolver({
      paramMap: {
        get: () => 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
      },
    } as any, {} as any) as Observable<Nullable<Project>>;

    observable$.pipe(take(1)).subscribe((result) => {
      expect(notFound.emitNotFound).toHaveBeenCalled();
      expect(project.read).toHaveBeenCalledWith({
        route: ':id',
        ids: 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
        query: {
          includes: ['owner', 'members', 'members.user', 'reports', 'milestones', 'milestones.estimates'],
          sparseFieldsets: {
            members: ['id', 'role'],
            'members.user': ['id', 'academicTitle', 'firstName', 'lastName', 'matriculationNumber', 'email', 'phoneNumber'],
            reports: ['id', 'sequenceNumber', 'reportDate'],
            milestones: ['id', 'name', 'milestoneReached'],
          },
        },
      });
      expect(result).toBeNull();

      done();
    });
  });
});
