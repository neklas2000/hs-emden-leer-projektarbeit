import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable, of, take } from 'rxjs';

import { Project } from '@Models/project';
import { userProjectsResolver } from '@Resolvers/user-projects.resolver';
import { ProjectService } from '@Services/project.service';

describe('Resolver: userProjectsResolver', () => {
  const executeResolver: ResolveFn<Observable<Project[]>> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => userProjectsResolver(...resolverParameters));
  let projects: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        provideHttpClient(),
      ],
    });
    projects = TestBed.inject(ProjectService);
  });

  it('should create', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should return an array of projects', (done) => {
    spyOn(projects, 'readAll').and.returnValue(of([]));

    const observable$ =  executeResolver({} as any, {} as any) as Observable<Project[]>;

    observable$.pipe(take(1)).subscribe((result) => {
      expect(result).toEqual([]);
      expect(projects.readAll).toHaveBeenCalled();

      done();
    });
  });
});
