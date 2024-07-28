import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { ProjectReport } from '@Models/project-report';
import { ProjectReportService } from '@Services/project-report.service';
import { Nullable } from '@Types';

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
export const reportDetailsResolver: ResolveFn<Observable<Nullable<ProjectReport>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  projectReports: ProjectReportService = inject(ProjectReportService),
) => {
  const projectId = route.paramMap.get('projectId');
  const filters: { [field: string]: string | number; } = {};

  if (projectId) {
    filters['project.id'] = projectId;
  }

  return projectReports.read<ProjectReport>({
    route: ':id',
    ids: route.paramMap.get('reportId') ?? undefined,
    query: {
      filters,
      includes: ['project'],
    },
  });
};
