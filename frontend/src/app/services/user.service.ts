import { Injectable } from '@angular/core';

import { JsonApiConnectorService } from './json-api-connector.service';
import { User } from '@Models/user';

/**
 * @description
 * This service provides the generic CRUD operations from the json api connector using the default
 * endpoint 'users'.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService extends JsonApiConnectorService<User> {
  constructor() {
    super('users');
  }
}
