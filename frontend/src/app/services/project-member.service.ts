import { Injectable } from '@angular/core';

import { JsonApiConnectorService } from './json-api-connector.service';
import { ProjectMember } from '@Models/project-member';

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
