import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { JsonApiDatastore } from '../services/json-api-datastore.service';
import { Project } from '../models/project';
import { Nullable } from '../types/nullable';

export const milestoneEstimatesProjectResolver: ResolveFn<Nullable<Observable<Project>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  jsonApiDatastore: JsonApiDatastore = inject(JsonApiDatastore),
) => {
  return jsonApiDatastore.load<Project>(Project, route.paramMap.get('id'), {
    sparseFieldsets: {
      project: ['id', 'officialStart', 'officialEnd', 'reportInterval'],
    },
  });
};
