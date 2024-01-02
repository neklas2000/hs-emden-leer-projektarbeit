import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { reportDetailsResolver } from './report-details.resolver';

describe('reportDetailsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => reportDetailsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
