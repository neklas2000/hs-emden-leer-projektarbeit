import { Injectable } from '@angular/core';

import { catchError, Observable } from 'rxjs';

import { User } from '@Models/user';
import { JsonApiConnectorService, JsonApiQueries } from '@Services/json-api-connector.service';
import { HttpException } from '@Utils/http-exception';

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

  search(searchTerm: string, query?: JsonApiQueries): Observable<User[]> {
    const uri = this.getUri('search') + this.parseJsonApiQuery(query);

    return this.httpClient.post<User[]>(uri, {
      searchTerm,
    }).pipe(catchError((err) => {
      throw new HttpException(err);
    }));
  }
}
