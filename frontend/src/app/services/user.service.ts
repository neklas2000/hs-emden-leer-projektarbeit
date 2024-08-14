import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { User } from '@Models/user';
import { JsonApiConnectorService, JsonApiQueries, JsonApiResponseBody } from '@Services/json-api-connector.service';

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

    return this.handleJsonApiRequest(
      this.httpClient.post<JsonApiResponseBody<User[]>>(uri, {
        searchTerm,
      }),
    );
  }
}
