import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { JsonApiDatastore } from '../services/json-api-datastore.service';
import { ProjectReport } from '../models/project-report';
import { Nullable } from '../types/nullable';

export const reportDetailsResolver: ResolveFn<Nullable<Observable<ProjectReport>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  jsonApiDatastore: JsonApiDatastore = inject(JsonApiDatastore),
) => {
  const projectId = route.paramMap.get('projectId');
  const filters: { [field: string]: string | number; } = {};

  if (projectId) {
    filters['project.id'] = projectId;
  }

  return jsonApiDatastore.load<ProjectReport>(
    ProjectReport,
    route.paramMap.get('reportId'),
    {
      filters,
      includes: ['project'],
    },
  );
};
