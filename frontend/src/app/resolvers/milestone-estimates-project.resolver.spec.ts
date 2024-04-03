import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { milestoneEstimatesProjectResolver } from './milestone-estimates-project.resolver';

describe('milestoneEstimatesProjectResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => milestoneEstimatesProjectResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
