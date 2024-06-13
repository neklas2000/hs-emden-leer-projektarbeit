import { Injectable } from '@angular/core';
import { JsonApiConnectorService } from './json-api-connector.service';
import { ProjectMember } from '@Models/project-member';

@Injectable({
  providedIn: 'root'
})
export class ProjectMemberService extends JsonApiConnectorService<ProjectMember> {
  constructor() {
    super('project/members');
  }
}
