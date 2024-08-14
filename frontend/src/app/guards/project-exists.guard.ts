import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

import { catchError, map, of, take } from 'rxjs';

import { NotFoundService } from '@Services/not-found.service';
import { ProjectService } from '@Services/project.service';
import { UUID } from '@Utils/uuid';

export const projectExistsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  projects: ProjectService = inject(ProjectService),
  notFound: NotFoundService = inject(NotFoundService),
) => {
  const { paramMap } = route;

  const projectId = paramMap.get('projectId');

  if (!UUID.isWellFormed(projectId)) {
    notFound.emitNotFound();

    return true;
  }

  return projects.read({ route: ':id', ids: projectId! }).pipe(
    take(1),
    map((_) => {
      return true;
    }),
    catchError((err) => {
      notFound.emitNotFound();

      return of(true);
    }),
  );
};
