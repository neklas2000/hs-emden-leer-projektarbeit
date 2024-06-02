import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Project } from '@Models/project';
import { JsonApiDatastore } from '@Services/json-api-datastore.service';
import { AuthenticationService } from '@Services/authentication.service';

export const userProjectsResolver: ResolveFn<Observable<Project[]>> = (
  route,
  state,
  jsonApiDatastore: JsonApiDatastore = inject(JsonApiDatastore),
  authentication: AuthenticationService = inject(AuthenticationService),
) => {
  const userId = authentication.getUser();

  if (!userId) return of([]);

  return jsonApiDatastore
    .loadAll<Project>(Project, {
      filters: {
        'owner.id': userId,
        'members.user.id': userId,
      },
    });
};
