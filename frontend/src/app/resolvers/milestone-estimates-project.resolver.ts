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
 * This function returns a resolver which resolves a specific project in order
 * to use it's data while editing milestone estimates or creating a new project
 * report. While accessing the data only the required fields for the editing are
 * loaded through the sparse fieldsets.
 *
 * @param projectIdParam The param name of the project id. - default: `'id'`
 * @returns The resolver function.
 */
export function milestoneEstimatesProjectResolver(
  projectIdParam: string = 'id',
): ResolveFn<Nullable<Observable<Nullable<Project>>>> {
  return (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    projects: ProjectService = inject(ProjectService),
    notFound: NotFoundService = inject(NotFoundService),
  ) => {
    const { paramMap } = route;

    const id = paramMap.get(projectIdParam);

    if (!UUID.isWellFormed(id)) {
      notFound.emitNotFound();

      return null;
    }

    return projects.read<Project>({
      route: ':id',
      ids: id!,
      query: {
        includes: ['reports'],
        sparseFieldsets: {
          project: ['id', 'officialStart', 'officialEnd', 'reportInterval'],
          reports: ['id', 'sequenceNumber', 'reportDate'],
        },
      },
    }).pipe(catchError(() => {
      notFound.emitNotFound();

      return of(null);
    }));
  };
};
