import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';

import { Project } from '@Models/project';
import { AuthenticationService } from '@Services/authentication.service';
import { ProjectService } from '@Services/project.service';

/**
 * @description
 * This resolver resolves all projects an user is the owner of or is a member of.
 *
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @param projects An automatically injected service to access the resource "projects".
 * @param authentication An automatically injected service to access data received during the
 * authentication process.
 * @returns An observable which resolves to an array of projects.
 */
export const userProjectsResolver: ResolveFn<Observable<Project[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  projects: ProjectService = inject(ProjectService),
  authentication: AuthenticationService = inject(AuthenticationService),
) => {
  const userId = authentication.getUser();

  if (!userId) return of([]);

  return projects.readAll('', {
    filters: {
      'owner.id': userId,
      'members.user.id': userId,
    },
  });
};
