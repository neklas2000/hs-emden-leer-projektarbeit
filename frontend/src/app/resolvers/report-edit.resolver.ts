import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';

import { ProjectReport } from '@Models/project-report';
import { ProjectReportService } from '@Services/project-report.service';
import { Nullable } from '@Types';

/**
 * @description
 * This resolver resolves a specific project report in order to edit it's data.
 *
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @param projectReports An automatically injected service to access the resource "project/reports".
 * @returns An observable which resolves to the correct project report or `null`, if it couldn't be
 * found.
 */
export const reportEditResolver: ResolveFn<Observable<Nullable<ProjectReport>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  projectReports: ProjectReportService = inject(ProjectReportService),
) => {
  const { paramMap } = route;

  if (!paramMap.has('projectId') || !paramMap.has('reportId')) {
    return of(null);
  }

  const projectId = paramMap.get('projectId')!;
  const reportId = paramMap.get('reportId')!;

  return projectReports.read<ProjectReport>({
    route: ':id',
    ids: reportId,
    query: {
      filters: {
        'project.id': projectId,
      },
    },
  });
};
