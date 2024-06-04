import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { ProjectReport } from '@Models/project-report';
import { ProjectReportService } from '@Services/project-report.service';
import { Nullable } from '@Types';

type Filters = {
  [field: string]: string | number;
};

export const reportEditResolver: ResolveFn<Observable<Nullable<ProjectReport>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  projectReports: ProjectReportService = inject(ProjectReportService),
) => {
  const projectId = route.paramMap.get('projectId');
  const filters: Filters = {};

  if (projectId) {
    filters['project.id'] = projectId;
  }

  return projectReports.read({
    route: ':id',
    ids: route.paramMap.get('reportId') ?? undefined,
    query: {
      filters,
    },
  });
};
