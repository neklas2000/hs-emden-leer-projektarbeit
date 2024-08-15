import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { catchError, Observable, of } from 'rxjs';

import { Project } from '@Models/project';
import { NotFoundService } from '@Services/not-found.service';
import { ProjectService } from '@Services/project.service';
import { Nullable } from '@Types';
import { UUID } from '@Utils/uuid';

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
export const projectDetailsResolver: ResolveFn<Nullable<Observable<Nullable<Project>>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  projects: ProjectService = inject(ProjectService),
  notFound: NotFoundService = inject(NotFoundService),
) => {
  const { paramMap } = route;

  const projectId = paramMap.get('id');

  if (!UUID.isWellFormed(projectId)) {
    notFound.emitNotFound();

    return null;
  }

  return projects.read<Project>({
    route: ':id',
    ids: projectId!,
    query: {
      includes: ['owner', 'members', 'members.user', 'reports', 'milestones', 'milestones.estimates'],
      sparseFieldsets: {
        members: ['id', 'role'],
        'members.user': ['id', 'academicTitle', 'firstName', 'lastName', 'matriculationNumber', 'email', 'phoneNumber'],
        reports: ['id', 'sequenceNumber', 'reportDate'],
        milestones: ['id', 'name', 'milestoneReached'],
      },
    },
  }).pipe(catchError(() => {
    notFound.emitNotFound();

    return of(null);
  }));
};
