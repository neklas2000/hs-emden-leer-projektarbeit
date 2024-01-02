import { ResolveFn } from '@angular/router';

import { Nullable } from '../types/nullable';
import { Project } from '../models/project';
import { inject } from '@angular/core';
import { JsonApiDatastore } from '../services/json-api-datastore.service';

export const projectDetailsResolver: ResolveFn<Nullable<Project>> = (
  route,
  state,
) => {
  return inject(JsonApiDatastore).load<Project>(Project, route.paramMap.get('id'), {
    includes: ['owner', 'members', 'members.user', 'reports', 'milestones'],
    sparseFieldsets: {
      members: ['id', 'role'],
      'members.user': ['id', 'firstName', 'lastName', 'matriculationNumber', 'email', 'phoneNumber'],
      reports: ['id', 'sequenceNumber', 'reportDate'],
      milestones: ['id', 'name'],
    },
  });
};
