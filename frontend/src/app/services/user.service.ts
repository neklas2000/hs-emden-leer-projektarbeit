import { Injectable } from '@angular/core';
import { JsonApiConnectorService } from './json-api-connector.service';
import { User } from '@Models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends JsonApiConnectorService<User> {
  constructor() {
    super('users');
  }
}
