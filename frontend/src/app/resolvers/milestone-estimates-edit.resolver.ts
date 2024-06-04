import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { ProjectMilestone } from '@Models/project-milestone';
import { ProjectMilestoneService } from '@Services/project-milestone.service';

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
