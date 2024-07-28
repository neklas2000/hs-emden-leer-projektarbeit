import { Injectable } from '@angular/core';

import { JsonApiConnectorService } from './json-api-connector.service';
import { ProjectMilestone } from '@Models/project-milestone';

/**
 * @description
 * This service provides the generic CRUD operations from the json api connector using the default
 * endpoint 'project/milestones'.
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectMilestoneService extends JsonApiConnectorService<ProjectMilestone> {
  constructor() {
    super('project/milestones');
  }
}
