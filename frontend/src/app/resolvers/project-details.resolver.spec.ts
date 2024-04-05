import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { Project } from '@Models/project';
import { projectDetailsResolver } from './project-details.resolver';
import { Nullable } from '@Types';

describe('Resolver: projectDetailsResolver', () => {
  const executeResolver: ResolveFn<Nullable<Observable<Project>>> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => projectDetailsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
