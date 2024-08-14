import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable, catchError, forkJoin, map } from 'rxjs';

import { DeepPartial, Nullable, Undefinable } from '@Types';
import { HttpException } from '@Utils/http-exception';

/**
 * @description
 * This type represents the response type when receiving an answer while updating or deleting a
 * ressource.
 */
type SuccessResponse = {
  success: boolean;
};

/**
 * @description
 * This type represents the query options which can be provided while requesting data. These are
 * query options from the json api specification in order to reduce or extend the data requested
 * from the api.
 */
export type JsonApiQueries = {
  includes?: string[];
  sparseFieldsets?: {
    [table: string]: string[];
  };
  filters?: {
    [field: string]: Nullable<string | number | boolean>;
  };
};

/**
 * @description
 * The provided keys will be combined with a colon to replace the value within the provided route.
 */
type RequestIds = {
  [key: string]: any;
};

/**
 * @description
 * This type represents an object of possible arguments when reading data from the api.
 */
type ReadParameters = {
  route?: string;
  ids?: RequestIds | string;
  query?: JsonApiQueries;
};

export type JsonApiResponseBody<T> = {
  data: Nullable<T>;
};

/**
 * @description
 * This class provides a generic implementation of the CRUD operations to manipulate data in the
 * database. If a resource has a common prefix, it can be provided in the `super`-constructor. This
 * avoids that this common prefix has to be provided everytime if a CRUD operation is called.
 */
export class JsonApiConnectorService<T> {
  private readonly baseUrl = '/api/v1' as const;
  private readonly resourcePrefix: string;
  protected readonly httpClient: HttpClient;

  constructor(prefix: string = '') {
    this.httpClient = inject(HttpClient);
    this.resourcePrefix = prefix;
  }

  /**
   * @description
   * This function represents the CRUD operation "Create". It allows that one new resource can be
   * inserted into the database by sending http requests to the api.
   *
   * @usageNotes
   * ### Create a new product
   * ```ts
   * const connector = new JsonApiConnectorService<Product>('products');
   * // ~> This sends a http post request to the route /api/v1/products
   * connector.createAll('', { name: 'A' }).subscribe(...); // Handle the subscription
   * ```
   *
   * @param route The specific endpoint of the api (e.g. "foo").
   * @param resources The data of the resource which will be inserted into the database.
   * @returns An observable resolving to the inserted data record (now expanded by the id).
   */
  create<T_RETURN = T>(route: string, resource: DeepPartial<T>): Observable<T_RETURN> {
    const uri = this.getUri(route);

    return this.handleJsonApiRequest(
      this.httpClient.post<JsonApiResponseBody<T_RETURN>>(uri, resource),
    );
  }

  /**
   * @description
   * This function represents the CRUD operation "Create". It allows that multiple resources can be
   * inserted into the database by sending http requests to the api.
   *
   * @usageNotes
   * ### Create two new products at the same time
   * ```ts
   * const connector = new JsonApiConnectorService<Product>('products');
   * // ~> This sends a http post request to the route /api/v1/products
   * connector.createAll('', [{ name: 'A' }, { name: 'B' }]).subscribe(...); // Handle the subscription
   * ```
   *
   * @param route The specific endpoint of the api (e.g. "foo").
   * @param resources An array of resources which will be inserted into the database.
   * @returns An observable resolving to the inserted data records (now expanded by their ids).
   */
  createAll<T_RETURN = T>(route: string, ...resources: DeepPartial<T>[]): Observable<T_RETURN[]> {
    const uri = this.getUri(route);

    return forkJoin([...resources].map((entry) => {
      return this.handleJsonApiRequest(
        this.httpClient.post<JsonApiResponseBody<T_RETURN>>(uri, entry),
      );
    }));
  }

  /**
   * @description
   * This function represents the CRUD operation "Read". It allows that all resources can be
   * read from the database by sending a http request to the api.
   *
   * @usageNotes
   * ### Read all products
   * ```ts
   * const connector = new JsonApiConnectorService<Product>('products');
   * // ~> This sends a http get request to the route /api/v1/products
   * connector.readAll('').subscribe(...); // Handle the subscription
   * ```
   *
   * @param route The specific endpoint of the api (e.g. "foo").
   * @param query An optional object of json api query options to reduce or extend the data
   * requested from the api.
   * @returns An observable resolving to the found data records or an empty array.
   */
  readAll<T_RETURN = T>(
    route?: string,
    query?: JsonApiQueries,
    ids?: RequestIds | string,
  ): Observable<T_RETURN[]> {
    const uri = this.getUri(this.replaceIds(route, ids)) + this.parseJsonApiQuery(query);

    return this.handleJsonApiRequest(this.httpClient.get<JsonApiResponseBody<T_RETURN[]>>(uri));
  }

  /**
   * @description
   * This function represents the CRUD operation "Read". It allows that a specific resource can be
   * read from the database by sending a http request to the api. The api endpoint is expected to
   * contain an id to specifiy which data record needs to be read precisely.
   *
   * @usageNotes
   * ### Read a product with the id "1"
   * ```ts
   * const connector = new JsonApiConnectorService<Product>('products');
   * // ~> This sends a http get request to the route /api/v1/products/1
   * connector.read({ route: ':id', ids: '1' }).subscribe(...); // Handle the subscription
   * ```
   *
   * @param params An optional object of optional arguments. It is possible to provide a route,
   * which is the specific endpoint of the api. The route should consist of an id (e.g. "/foo/:id").
   * It is also possible to provide the id either as a string or a map of multiple ids if the
   * `route` consists of multiple ids. In order to reduce or extend the data requested from the api,
   * it is possible to provide json api query options.
   * @returns An observable resolving to the found data record or `null`.
   */
  read<T_RETURN = T>(params?: ReadParameters): Observable<T_RETURN> {
    let uri = this.getUri();

    if (params) {
      const { route, ids, query } = params;
      uri = this.getUri(this.replaceIds(route, ids)) + this.parseJsonApiQuery(query);
    }

    return this.handleJsonApiRequest(this.httpClient.get<JsonApiResponseBody<T_RETURN>>(uri));
  }

  /**
   * @description
   * This function represents the CRUD operation "Update". It allows that a resource can be updated
   * in the database by sending a http request to the api. The api endpoint is expected to contain
   * an id to specifiy which data record needs to be updated precisely.
   *
   * @usageNotes
   * ### Update a product with the id "1"
   * ```ts
   * const connector = new JsonApiConnectorService<Product>('products');
   * // ~> This sends a http patch request to the route /api/v1/products/1 with the payload defined
   * //    by the third argument.
   * connector.update(':id', '1', { name: 'Hello World' }).subscribe(...); // Handle the subscription
   * ```
   *
   * @param route The specific endpoint of the api consisting of an id (e.g. "/foo/:id").
   * @param ids The id either as a string or a map of multiple ids if the `route` consists of more.
   * @param data The updated properties of the resource which will be send as the requests payload.
   * @returns An observable with a boolean value indicating if the update was successful.
   */
  update(route: string, ids: RequestIds | string, data: DeepPartial<T>): Observable<boolean> {
    const uri = this.getUri(this.replaceIds(route, ids));

    return this.handleJsonApiRequest(
      this.httpClient.patch<JsonApiResponseBody<SuccessResponse>>(uri, data),
    ).pipe(map((response) => {
      return response.success;
    }));
  }

  /**
   * @description
   * This function represents the CRUD operation "Delete". It allows that a resource can be deleted
   * from the database by sending a http request to the api. The api endpoint is expected to contain
   * an id to specifiy which data record needs to be deleted precisely.
   *
   * @usageNotes
   * ### Delete a product with the id "1"
   * ```ts
   * const connector = new JsonApiConnectorService<Product>('products');
   * // ~> This sends a http delete request to the route /api/v1/products/1
   * connector.delete(':id', '1').subscribe(...); // Handle the subscription
   * ```
   *
   * @param route The specific endpoint of the api consisting of an id (e.g. "/foo/:id").
   * @param ids The id either as a string or a map of multiple ids if the `route` consists of more.
   * @returns An observable with a boolean value indicating if the deletion was successful.
   */
  delete(route?: string, ids?: RequestIds | string): Observable<boolean> {
    const uri = this.getUri(this.replaceIds(route, ids));

    return this.handleJsonApiRequest(
      this.httpClient.delete<JsonApiResponseBody<SuccessResponse>>(uri),
    ).pipe(
      map((response) => {
        return response.success;
      }),
    );
  }

  /**
   * @description
   * This function replaces id patterns within the provided `route`. If no value for the `route` is
   * provided `undefined` will be returned and if no value for the `ids` is provided the `route`
   * will be returned. If both arguments are provided and the `ids` are of the type `string` it is
   * expected that the `route` includes the pattern ":id". If it doesn't include the pattern an
   * error will be thrown. If `ids` is an object each key will be extended by a colon to find the
   * pattern.
   *
   * @usageNotes
   * ### Replace the pattern ":id" with an id
   * ```ts
   * this.replaceIds('/users/:id', '1'); // ~> "/users/1"
   * ```
   *
   * ### Replace multiple patterns for ids
   * ```ts
   * this.replaceIds('/projects/:projectId/report/:reportId', { projectId: '123', reportId: '456' }); // ~> "/projects/123/report/456"
   * ```
   *
   * @param route A optional route which could look like ":id".
   * @param ids An optional string or object of ids (e.g. `{ id: '1' }`).
   * @returns The route populated by the given ids.
   */
  protected replaceIds(route?: string, ids?: RequestIds | string): Undefinable<string> {
    if (!route) return undefined;
    if (!ids) return route;

    if (typeof ids === 'string') {
      if (!route.includes(':id')) {
        throw new Error(
          'The provided value for ids was of the type "string", so it was expected that the ' +
          'route includes the pattern ":id", but it does not (the route: ${route}).',
        );
      }

      route = route.replace(':id', ids);
    } else {
      for (const id in ids) {
        route = route.replace(`:${id}`, ids[id]);
      }
    }

    return route;
  }

  /**
   * @description
   * This function builds the request url consisting of the base url, an optional prefix of the
   * endpoint and another optional route.
   *
   * @param route A subroute which might be needed to be more specific when accessing an endpoint.
   * @returns The merged request url.
   */
  protected getUri(route?: string): string {
    let uri: string = this.baseUrl;

    if (this.resourcePrefix !== '') {
      uri += `/${this.resourcePrefix}`;
    }

    if (!route) return uri;

    return uri + `/${route}`;
  }

  /**
   * @description
   * This function parses the json api query options so that they can be added to the request url.
   *
   * @param query The query options defined by the json api specification.
   * @returns A string representing the query options.
   */
  protected parseJsonApiQuery(query?: JsonApiQueries): string {
    if (!query) return '';

    let queries = [];

    if (query.includes) {
      queries.push(`include=${query.includes.join(',')}`);
    }

    if (query.sparseFieldsets) {
      for (const table in query.sparseFieldsets) {
        queries.push(`fields[${table}]=${query.sparseFieldsets[table].join(',')}`);
      }
    }

    if (query.filters) {
      for (const field in query.filters) {
        if (query.filters[field] === null) {
          queries.push(`filter[${field}]=NULL`);
        } else {
          queries.push(`filter[${field}]=${query.filters[field]}`);
        }
      }
    }

    if (queries.length === 0) return '';

    return `?${queries.join('&')}`;
  }

  /**
   * @description
   * This function handles every request in the same way. In case an exception occurs the error will
   * be parsed to an object of the `HttpException`. The response body will be parsed correctly so
   * only the actual data will be returned. If the request couldn't resolve any data a new error is
   * thrown. In the other cases the actual data will be returned, either as an object or as an array.
   *
   * The reponse body of every request within this app will look like the following:
   * ### In case no data was found
   * ```json
   * {
   *    "data": null,
   * }
   * ```
   *
   * ### In case an array of data was resolved
   * ```json
   * {
   *    "data": [ ... ],
   * }
   * ```
   *
   * ### In case an object of data was resolved
   * ```json
   * {
   *    "data": { ... },
   * }
   * ```
   *
   * @param request$ An observable object representing the request to be executed.
   * @returns An observable resolving to `null` if no data was found within the response body or the
   * actual data.
   * @throws An error if the response body didn't include any data.
   */
  protected handleJsonApiRequest<T_RETURN = T>(
    request$: Observable<JsonApiResponseBody<T_RETURN>>,
  ): Observable<T_RETURN> {
    return request$.pipe(
      catchError((err) => {
        throw new HttpException(err);
      }),
      map((responseBody) => {
        if (responseBody.data === null) {
          throw new HttpException({
            code: 'HSEL-404-001',
            description: 'The http request resulted in no data which could be found by the given ' +
              'filter criteria.',
            message: 'No data record/s could be found',
            status: 404,
            name: 'Not Found',
            ok: false,
            statusText: 'Http error 404 Not Found',
          });
        }

        return responseBody.data;
      }),
    );
  }
}
