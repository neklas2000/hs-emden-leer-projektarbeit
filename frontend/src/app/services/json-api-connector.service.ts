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

export class JsonApiConnectorService {
  private readonly baseUrl = '/api/v1' as const;
  private readonly httpClient: HttpClient;
  private readonly resourcePrefix: string;

  constructor(prefix: string = '') {
    this.httpClient = inject(HttpClient);
    this.resourcePrefix = prefix;
  }

  create<T, T_RETURN = T>(route: string, resource: T): Observable<T_RETURN> {
    const uri = this.getUri(route);

    return this.httpClient.post<T_RETURN>(uri, resource)
      .pipe(catchError((err) => {
        throw new HttpException(err);
      }));
  }

  createAll<T, T_RETURN = T>(route: string, ...resources: T[]): Observable<T_RETURN[]> {
    const uri = this.getUri(route);

    return forkJoin([...resources].map((entry) => {
      return this.httpClient.post<T_RETURN>(uri, entry)
        .pipe(catchError((err) => {
          throw new HttpException(err);
        }));
    }));
  }

  readAll<T>(route: string, query?: JsonApiQueries): Observable<T[]> {
    const uri = this.getUri(route) + parseJsonApiQuery(query);

    return this.httpClient.get<T[]>(uri)
      .pipe(catchError((err) => {
        throw new HttpException(err);
      }));
  }

  read<T>(params?: ReadParameters): Observable<Nullable<T>> {
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

  update<T>(route: string, ids: RequestIds | string, data: DeepPartial<T>): Observable<boolean> {
    const uri = this.getUri(this.replaceIds(route, ids));

    return this.httpClient.patch<SuccessResponse>(uri, data)
      .pipe(
        catchError((err) => {
          throw new HttpException(err);
        }),
        switchMap((response) => of(response.success)),
      );
  }

  private replaceIds(route?: string, ids?: RequestIds | string): Undefinable<string> {
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

  private getUri(route?: string): string {
    let uri: string = this.baseUrl;

    if (this.resourcePrefix !== '') {
      uri += `/${this.resourcePrefix}`;
    }

    if (!route) return uri;

    return uri + `/${route}`;
  }
}
