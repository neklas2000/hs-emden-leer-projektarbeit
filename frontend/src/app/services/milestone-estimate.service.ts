import { Injectable } from '@angular/core';
import { JsonApiConnectorService } from './json-api-connector.service';
import { MilestoneEstimate } from '@Models/milestone-estimate';

@Injectable({
  providedIn: 'root'
})
export class MilestoneEstimateService extends JsonApiConnectorService<MilestoneEstimate> {
  constructor() {
    super('milestone/estimates');
  }
}
