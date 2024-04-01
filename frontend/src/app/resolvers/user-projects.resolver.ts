import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { switchMap, take } from 'rxjs';

import { Project } from '../models/project';
import { JsonApiDatastore } from '../services/json-api-datastore.service';
import { AuthenticationService } from '../services/authentication.service';

export const userProjectsResolver: ResolveFn<Project[]> = (
  route,
  state,
  jsonApiDatastore: JsonApiDatastore = inject(JsonApiDatastore),
  auth: AuthenticationService = inject(AuthenticationService),
) => {
  return auth.user$.pipe(take(1), switchMap((user) => {
    if (user === null || user.id === null) return [];

    return jsonApiDatastore
      .loadAll<Project>(Project, {
        filters: {
          'owner.id': user.id,
        },
      });
  }));
};
