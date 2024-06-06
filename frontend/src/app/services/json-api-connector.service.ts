import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable, catchError, forkJoin, of, switchMap } from 'rxjs';

import { DeepPartial, JsonApiQueries, Nullable, RequestIds, Undefinable } from '@Types';
import { HttpException } from '@Utils/http-exception';
import { parseJsonApiQuery } from '@Utils/parse-json-api-query';

type SuccessResponse = {
  success: boolean;
};

type ReadParameters = {
  route?: string;
  ids?: RequestIds | string;
  query?: JsonApiQueries;
};

export class JsonApiConnectorService<T> {
  private readonly baseUrl = '/api/v1' as const;
  private readonly resourcePrefix: string;
  protected readonly httpClient: HttpClient;

  constructor(prefix: string = '') {
    this.httpClient = inject(HttpClient);
    this.resourcePrefix = prefix;
  }

  create<T_RETURN = T>(route: string, resource: DeepPartial<T>): Observable<T_RETURN> {
    const uri = this.getUri(route);

    return this.httpClient.post<T_RETURN>(uri, resource)
      .pipe(catchError((err) => {
        throw new HttpException(err);
      }));
  }

  createAll<T_RETURN = T>(route: string, ...resources: DeepPartial<T>[]): Observable<T_RETURN[]> {
    const uri = this.getUri(route);

    return forkJoin([...resources].map((entry) => {
      return this.httpClient.post<T_RETURN>(uri, entry)
        .pipe(catchError((err) => {
          throw new HttpException(err);
        }));
    }));
  }

  readAll(route: string, query?: JsonApiQueries): Observable<T[]> {
    const uri = this.getUri(route) + parseJsonApiQuery(query);

    return this.httpClient.get<T[]>(uri)
      .pipe(catchError((err) => {
        throw new HttpException(err);
      }));
  }

  read(params?: ReadParameters): Observable<Nullable<T>> {
    let uri = this.getUri();

    if (params) {
      const { route, ids, query } = params;
      uri = this.getUri(this.replaceIds(route, ids)) + parseJsonApiQuery(query);
    }

    return this.httpClient.get<T>(uri)
      .pipe(catchError((err) => {
        throw new HttpException(err);
      }));
  }

  update(route: string, ids: RequestIds | string, data: DeepPartial<T>): Observable<boolean> {
    const uri = this.getUri(this.replaceIds(route, ids));

    return this.httpClient.patch<SuccessResponse>(uri, data)
      .pipe(
        catchError((err) => {
          throw new HttpException(err);
        }),
        switchMap((response) => of(response.success)),
      );
  }

  delete(route: string, ids: RequestIds | string): Observable<boolean> {
    const uri = this.getUri(this.replaceIds(route, ids));

    return this.httpClient.delete<SuccessResponse>(uri)
      .pipe(
        catchError((err) => {
          throw new HttpException(err);
        }),
        switchMap((response) => of(response.success)),
      );
  }

  protected replaceIds(route?: string, ids?: RequestIds | string): Undefinable<string> {
    if (!route) return undefined;
    if (!ids) return route;

    if (typeof ids === 'string') {
      route = route.replace(':id', ids);
    } else {
      for (const id in ids) {
        route = route.replace(`:${id}`, ids[id]);
      }
    }

    return route;
  }

  protected getUri(route?: string): string {
    let uri: string = this.baseUrl;

    if (this.resourcePrefix !== '') {
      uri += `/${this.resourcePrefix}`;
    }

    if (!route) return uri;

    return uri + `/${route}`;
  }
}
