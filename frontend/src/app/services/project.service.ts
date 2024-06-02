import { Injectable } from '@angular/core';

import { JsonApiConnectorService } from './json-api-connector.service';
import { Project } from '@Models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends JsonApiConnectorService<Project> {
  constructor() {
    super('projects');
  }
}
