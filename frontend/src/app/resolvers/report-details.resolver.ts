import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable, of, switchMap } from 'rxjs';

import { ProjectReport } from '@Models/project-report';
import { NotFoundService } from '@Services/not-found.service';
import { ProjectReportService } from '@Services/project-report.service';
import { Nullable } from '@Types';
import { UUID } from '@Utils/uuid';

/**
 * @description
 * This resolver resolves a specific project report in order to display it's data on a details page.
 *
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @param projectReports An automatically injected service to access the resource "project/reports".
 * @returns An observable which resolves to the correct project report or `null`, if it couldn't be
 * found.
 */
export const reportDetailsResolver: ResolveFn<Nullable<Observable<Nullable<ProjectReport>>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  projectReports: ProjectReportService = inject(ProjectReportService),
  notFound: NotFoundService = inject(NotFoundService),
) => {
  const { paramMap } = route;

  const projectId = paramMap.get('projectId');
  const reportId = paramMap.get('reportId');

  if (!UUID.isWellFormed(projectId) || !UUID.isWellFormed(reportId)) {
    notFound.emitNotFound();

    return null;
  }

  return projectReports.read<ProjectReport>({
    route: ':id',
    ids: reportId!,
    query: {
      filters: {
        'project.id': projectId,
      },
      includes: ['project'],
    },
  }).pipe(switchMap((report) => {
    if (!report) {
      notFound.emitNotFound();
    }

    return of(report);
  }));
};
