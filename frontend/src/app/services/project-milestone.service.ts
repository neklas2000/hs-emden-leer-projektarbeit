import { Injectable } from '@angular/core';

import { ProjectMilestone } from '@Models/project-milestone';
import { JsonApiConnectorService } from '@Services/json-api-connector.service';

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
