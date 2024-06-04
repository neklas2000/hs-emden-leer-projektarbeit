import { Injectable } from '@angular/core';

import { JsonApiConnectorService } from './json-api-connector.service';
import { ProjectMilestone } from '@Models/project-milestone';

@Injectable({
  providedIn: 'root'
})
export class ProjectMilestoneService extends JsonApiConnectorService<ProjectMilestone> {
  constructor() {
    super('project/milestones');
  }
}
