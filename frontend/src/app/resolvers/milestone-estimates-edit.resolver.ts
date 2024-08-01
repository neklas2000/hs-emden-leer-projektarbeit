import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { ProjectMilestone } from '@Models/project-milestone';
import { NotFoundService } from '@Services/not-found.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { Nullable } from '@Types';
import { UUID } from '@Utils/uuid';

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
export const milestoneEstimatesEditResolver: ResolveFn<Nullable<Observable<ProjectMilestone[]>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  projectMilestones: ProjectMilestoneService = inject(ProjectMilestoneService),
  notFound: NotFoundService = inject(NotFoundService),
) => {
  const { paramMap } = route;

  const id = paramMap.get('id');

  if (!UUID.isWellFormed(id)) {
    notFound.emitNotFound();

    return null;
  }

  return projectMilestones.readAll('', {
    filters: {
      'project.id': id!,
    },
    includes: ['estimates'],
  });
};
