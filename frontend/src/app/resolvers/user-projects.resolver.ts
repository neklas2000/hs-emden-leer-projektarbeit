import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { Observable, switchMap, take } from 'rxjs';

import { Project } from '@Models/project';
import { JsonApiDatastore } from '@Services/json-api-datastore.service';
import { AuthenticationService } from '@Services/authentication.service';

export const userProjectsResolver: ResolveFn<Observable<Project[]>> = (
  route,
  state,
  jsonApiDatastore: JsonApiDatastore = inject(JsonApiDatastore),
  authentication: AuthenticationService = inject(AuthenticationService),
) => {
  return authentication.user$.pipe(take(1), switchMap((user) => {
    if (user === null || user.id === null) return [];

    return jsonApiDatastore
      .loadAll<Project>(Project, {
        filters: {
          'owner.id': user.id,
        },
      });
  }));
};
