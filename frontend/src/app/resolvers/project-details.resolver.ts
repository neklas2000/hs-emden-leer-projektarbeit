import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Project } from '@Models/project';
import { ProjectService } from '@Services/project.service';
import { Nullable } from '@Types';

export const projectDetailsResolver: ResolveFn<Observable<Nullable<Project>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  projects: ProjectService = inject(ProjectService),
) => {
  return projects.read<Project>({
    route: ':id',
    ids: route.paramMap.get('id') ?? undefined,
    query: {
      includes: ['owner', 'members', 'members.user', 'reports', 'milestones', 'milestones.estimates'],
      sparseFieldsets: {
        members: ['id', 'role'],
        'members.user': ['id', 'firstName', 'lastName', 'matriculationNumber', 'email', 'phoneNumber'],
        reports: ['id', 'sequenceNumber', 'reportDate'],
        milestones: ['id', 'name'],
      },
    },
  });
};
