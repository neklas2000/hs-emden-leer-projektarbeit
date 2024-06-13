import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Project } from '@Models/project';
import { ProjectService } from '@Services/project.service';
import { Nullable } from '@Types';

export const milestoneEstimatesProjectResolver: ResolveFn<Observable<Nullable<Project>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  projects: ProjectService = inject(ProjectService),
) => {
  return projects.read<Project>({
    route: ':id',
    ids: route.paramMap.get('id') ?? undefined,
    query: {
      sparseFieldsets: {
        project: ['id', 'officialStart', 'officialEnd', 'reportInterval'],
      },
    },
  });
};
