import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { JsonApiDatastore } from '../services/json-api-datastore.service';
import { ProjectReport } from '../models/project-report';
import { Nullable } from '../types/nullable';

export const reportDetailsResolver: ResolveFn<Nullable<ProjectReport>> = (
  route,
  state,
) => {
  const projectId = route.paramMap.get('projectId');
  const filters: { [field: string]: string | number; } = {};

  if (projectId) {
    filters['project.id'] = projectId;
  }

  return inject(JsonApiDatastore).load<ProjectReport>(
    ProjectReport,
    route.paramMap.get('reportId'),
    {
      filters,
      includes: ['project'],
    },
  );
};
