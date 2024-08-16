import { Injectable } from '@angular/core';

import { Project } from '@Models/project';
import { JsonApiConnectorService } from '@Services/json-api-connector.service';

/**
 * @description
 * This service provides the generic CRUD operations from the json api connector using the default
 * endpoint 'projects'.
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService extends JsonApiConnectorService<Project> {
  constructor() {
    super('projects');
  }
}
