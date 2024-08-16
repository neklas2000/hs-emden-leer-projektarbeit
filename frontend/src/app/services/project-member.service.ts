import { Injectable } from '@angular/core';

import { ProjectMember } from '@Models/project-member';
import { JsonApiConnectorService } from '@Services/json-api-connector.service';

/**
 * @description
 * This service provides the generic CRUD operations from the json api connector using the default
 * endpoint 'project/members'.
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectMemberService extends JsonApiConnectorService<ProjectMember> {
  constructor() {
    super('project/members');
  }
}
