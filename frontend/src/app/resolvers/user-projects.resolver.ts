import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { Project } from '../models/project';
import { JsonApiDatastore } from '../services/json-api-datastore.service';
import { AuthService } from '../services/auth.service';
import { switchMap, take } from 'rxjs';

export const userProjectsResolver: ResolveFn<Project[]> = (
  route,
  state,
  jsonApiDatastore: JsonApiDatastore = inject(JsonApiDatastore),
  auth: AuthService = inject(AuthService),
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
