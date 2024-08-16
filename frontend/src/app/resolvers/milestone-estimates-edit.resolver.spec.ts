import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { ProjectMilestone } from '@Models/project-milestone';
import { milestoneEstimatesEditResolver } from '@Resolvers/milestone-estimates-edit.resolver';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { Nullable } from '@Types';

describe('Resolver: milestoneEstimatesEditResolver', () => {
  const executeResolver: ResolveFn<Nullable<Observable<ProjectMilestone[]>>> =
    (...resolverParameters) => TestBed.runInInjectionContext(
      () => milestoneEstimatesEditResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectMilestoneService],
    });
  });

  it('should create', () => {
    expect(executeResolver).toBeTruthy();
  });
});
