import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { userProjectsResolver } from './user-projects.resolver';

describe('userProjectsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => userProjectsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
