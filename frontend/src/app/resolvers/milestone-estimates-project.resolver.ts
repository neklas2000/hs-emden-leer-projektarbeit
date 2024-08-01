import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Project } from '@Models/project';
import { NotFoundService } from '@Services/not-found.service';
import { ProjectService } from '@Services/project.service';
import { Nullable } from '@Types';
import { UUID } from '@Utils/uuid';

/**
 * @description
 * This resolver resolves a specific project in order to use it's data while editing milestone
 * estimates. While accessing the data only the required fields for the editing are loaded through
 * the sparse fieldsets.
 *
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @param projects An automatically injected service to access the resource "projects".
 * @returns An observable which resolves to the correct project or `null`, if it couldn't be
 * found.
 */
export const milestoneEstimatesProjectResolver: ResolveFn<Nullable<Observable<Nullable<Project>>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  projects: ProjectService = inject(ProjectService),
  notFound: NotFoundService = inject(NotFoundService),
) => {
  const { paramMap } = route;

  const id = paramMap.get('id');

  if (!UUID.isWellFormed(id)) {
    notFound.emitNotFound();

    return null;
  }

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
