import { Injectable } from '@angular/core';

import { MilestoneEstimate } from '@Models/milestone-estimate';
import { JsonApiConnectorService } from '@Services/json-api-connector.service';

/**
 * @description
 * This service provides the generic CRUD operations from the json api connector using the default
 * endpoint 'milestone/estimates'.
 */
@Injectable({
  providedIn: 'root'
})
export class MilestoneEstimateService extends JsonApiConnectorService<MilestoneEstimate> {
  constructor() {
    super('milestone/estimates');
  }
}
