import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { projectDetailsResolver } from './project-details.resolver';
import { Nullable } from '../types/nullable';
import { Project } from '../models/project';

describe('Resolver: projectDetailsResolver', () => {
  const executeResolver: ResolveFn<Nullable<Project>> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => projectDetailsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
