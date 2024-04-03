import { Injectable } from '@angular/core';

import { JsonApiConnectorService } from './json-api-connector.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends JsonApiConnectorService {
  constructor() {
    super('profile');
  }
}
