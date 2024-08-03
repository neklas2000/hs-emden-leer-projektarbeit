import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { JsonApiConnectorService } from './json-api-connector.service';
import { User } from '@Models/user';
import { Nullable } from '@Types';

/**
 * @description
 * This type represents the arguments which should be provided, when validating the users
 * credentials.
 */
type Credentials = {
  userId: string;
  email?: string;
  password: string;
};

/**
 * @description
 * This service provides the generic CRUD operations from the json api connector using the default
 * endpoint 'profile'.
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileService extends JsonApiConnectorService<User> {
  constructor() {
    super('profile');
  }

  /**
   * @description
   * This function sends a request to the api and tries to find one user matching the provided
   * credentials.
   *
   * @param userId The uuid of the user.
   * @param email The email address of the user.
   * @param password The password of the user.
   * @returns An observable of either null if no user could be found by these credentials or the
   * user object who was found.
   */
  validateCredentials({ userId, email, password }: Credentials): Observable<Nullable<User>> {
    return this.read({
      ids: userId,
      route: ':id',
      query: {
        filters: {
          password,
          ...(email ? { email } : {}),
        },
      },
    });
  }
}
