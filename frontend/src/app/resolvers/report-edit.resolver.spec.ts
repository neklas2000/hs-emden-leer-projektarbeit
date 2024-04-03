import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { reportEditResolver } from './report-edit.resolver';

describe('reportEditResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => reportEditResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
