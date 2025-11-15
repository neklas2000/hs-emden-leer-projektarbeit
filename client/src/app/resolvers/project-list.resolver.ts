import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { ProjectsService } from '../services/projects.service';

export const projectListResolver: ResolveFn<Entities.Project[]> =
  (route, state) => {
    const projects = inject(ProjectsService);

    return projects.readAll({});
  };
