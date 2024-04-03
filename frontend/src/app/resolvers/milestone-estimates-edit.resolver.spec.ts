import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { milestoneEstimatesEditResolver } from './milestone-estimates-edit.resolver';

describe('milestoneEstimatesEditResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => milestoneEstimatesEditResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
