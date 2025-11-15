import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { projectListResolver } from './project-list.resolver';

describe('projectListResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => projectListResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
