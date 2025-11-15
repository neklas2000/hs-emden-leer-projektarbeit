import { Injectable } from '@angular/core';
import { JsonApiConnector } from './json-api-connector';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService extends JsonApiConnector<Entities.Project> {
  constructor() {
    super('projects');
  }
}
