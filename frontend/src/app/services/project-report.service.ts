import { Injectable } from '@angular/core';

import { JsonApiConnectorService } from './json-api-connector.service';
import { ProjectReport } from '@Models/project-report';

@Injectable({
  providedIn: 'root'
})
export class ProjectReportService extends JsonApiConnectorService<ProjectReport> {
  constructor() {
    super('project/reports')
  }
}
