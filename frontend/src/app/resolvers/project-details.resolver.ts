import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Nullable } from '../types/nullable';
import { Project } from '../models/project';
import { JsonApiDatastore } from '../services/json-api-datastore.service';

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
