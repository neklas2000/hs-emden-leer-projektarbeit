import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Project } from '@Models/project';
import { JsonApiDatastore } from '@Services/json-api-datastore.service';
import { Nullable } from '@Types';

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
