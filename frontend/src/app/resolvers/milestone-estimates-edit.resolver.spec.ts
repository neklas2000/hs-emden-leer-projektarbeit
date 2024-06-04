import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { milestoneEstimatesEditResolver } from './milestone-estimates-edit.resolver';
import { ProjectMilestone } from '@Models/project-milestone';
import { ProjectMilestoneService } from '@Services/project-milestone.service';

describe('Resolver: milestoneEstimatesEditResolver', () => {
  const executeResolver: ResolveFn<Observable<ProjectMilestone[]>> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => milestoneEstimatesEditResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectMilestoneService],
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
