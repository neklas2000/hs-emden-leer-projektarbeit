import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Project } from '@Models/project';
import { AuthenticationService } from '@Services/authentication.service';
import { ProjectService } from '@Services/project.service';

export const userProjectsResolver: ResolveFn<Observable<Project[]>> = (
  route,
  state,
  projects: ProjectService = inject(ProjectService),
  authentication: AuthenticationService = inject(AuthenticationService),
) => {
  const userId = authentication.getUser();

  if (!userId) return of([]);

  return projects.readAll('', {
    filters: {
      'owner.id': userId,
      'members.user.id': userId,
    },
  });
};
