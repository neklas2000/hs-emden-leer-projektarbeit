import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { ProjectMilestone } from '../models/project-milestone';
import { JsonApiDatastore } from '../services/json-api-datastore.service';

export const milestoneEstimatesEditResolver: ResolveFn<Observable<ProjectMilestone[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  jsonApiDatastore: JsonApiDatastore = inject(JsonApiDatastore),
) => {
  const id = route.paramMap.get('id');

  return jsonApiDatastore.loadAll<ProjectMilestone>(ProjectMilestone, {
    filters: id ? { 'project.id': id } : {},
    includes: ['estimates'],
  });
};
