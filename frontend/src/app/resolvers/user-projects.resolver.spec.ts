import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { Project } from '@Models/project';
import { AuthenticationService } from '@Services/authentication.service';
import { ProjectService } from '@Services/project.service';
import { userProjectsResolver } from './user-projects.resolver';

describe('Resolver: userProjectsResolver', () => {
  const executeResolver: ResolveFn<Observable<Project[]>> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => userProjectsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationService, ProjectService],
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
