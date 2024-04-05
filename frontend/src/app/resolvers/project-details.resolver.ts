import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Project } from '@Models/project';
import { JsonApiDatastore } from '@Services/json-api-datastore.service';
import { Nullable } from '@Types';

export const projectDetailsResolver: ResolveFn<Nullable<Observable<Project>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  jsonApiDatastore: JsonApiDatastore = inject(JsonApiDatastore),
) => {
  return jsonApiDatastore.load<Project>(Project, route.paramMap.get('id'), {
    includes: ['owner', 'members', 'members.user', 'reports', 'milestones', 'milestones.estimates'],
    sparseFieldsets: {
      members: ['id', 'role'],
      'members.user': ['id', 'firstName', 'lastName', 'matriculationNumber', 'email', 'phoneNumber'],
      reports: ['id', 'sequenceNumber', 'reportDate'],
      milestones: ['id', 'name'],
    },
  });
};
