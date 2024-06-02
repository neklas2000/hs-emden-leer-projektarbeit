import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { JsonApiConnectorService } from './json-api-connector.service';
import { User } from '@Models/user';
import { Nullable } from '@Types';

type Credentials = {
  userId: string;
  email?: string;
  password: string;
};

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends JsonApiConnectorService<User> {
  constructor() {
    super('profile');
  }

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
