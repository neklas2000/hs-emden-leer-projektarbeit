import { Injectable } from '@angular/core';

import { JsonApiConnectorService } from './json-api-connector.service';
import { Project } from '@Models/project';

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
