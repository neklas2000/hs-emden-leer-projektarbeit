import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { ProjectMilestone } from '@Models/project-milestone';
import { ProjectMilestoneService } from '@Services/project-milestone.service';

/**
 * @description
 * This resolver resolves all milestones estimates of a project in order to edit the estimates.
 * While accessing the data the required relationship is loaded and the data is filtered by the
 * project id.
 *
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @param projectMilestones An automatically injected service to access the resource
 * "project/milestones".
 * @returns An observable which resolves to all milestone estimates associated with the project.
 */
export const milestoneEstimatesEditResolver: ResolveFn<Observable<ProjectMilestone[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  projectMilestones: ProjectMilestoneService = inject(ProjectMilestoneService),
) => {
  const id = route.paramMap.get('id');

  return projectMilestones.readAll('', {
    filters: id ? { 'project.id': id } : {},
    includes: ['estimates'],
  });
};
