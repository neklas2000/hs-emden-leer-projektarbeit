import { Injectable } from '@angular/core';

import { JsonApiConnectorService } from './json-api-connector.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectReportService extends JsonApiConnectorService {
  constructor() {
    super('project/reports')
  }
}
