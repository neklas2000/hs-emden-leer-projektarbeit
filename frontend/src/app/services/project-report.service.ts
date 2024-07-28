import { Injectable } from '@angular/core';

import { JsonApiConnectorService } from './json-api-connector.service';
import { ProjectReport } from '@Models/project-report';

/**
 * @description
 * This service provides the generic CRUD operations from the json api connector using the default
 * endpoint 'project/reports'.
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectReportService extends JsonApiConnectorService<ProjectReport> {
  constructor() {
    super('project/reports')
  }
}
