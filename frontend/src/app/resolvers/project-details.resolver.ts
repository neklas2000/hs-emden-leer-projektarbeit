import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Project } from '@Models/project';
import { ProjectService } from '@Services/project.service';
import { Nullable } from '@Types';

/**
 * @description
 * This resolver resolves a specific project in order to display it's data on a details page. While
 * accessing the data all required relationships are included and only the required fields for the
 * visualization are loaded through the sparse fieldsets.
 *
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @param projects An automatically injected service to access the resource "projects".
 * @returns An observable which resolves to the correct project or `null`, if it couldn't be
 * found.
 */
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
        'members.user': ['id', 'academicTitle', 'firstName', 'lastName', 'matriculationNumber', 'email', 'phoneNumber'],
        reports: ['id', 'sequenceNumber', 'reportDate'],
        milestones: ['id', 'name'],
      },
    },
  });
};
