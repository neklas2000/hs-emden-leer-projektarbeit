import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { milestoneEstimatesProjectResolver } from './milestone-estimates-project.resolver';
import { Project } from '@Models/project';
import { Nullable } from '@Types';

describe('Resolver: milestoneEstimatesProjectResolver', () => {
  const executeResolver: ResolveFn<Nullable<Observable<Project>>> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => milestoneEstimatesProjectResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
