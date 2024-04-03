import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable, catchError, forkJoin, of, switchMap } from 'rxjs';

import { HttpException } from '../types/http-exception';
import { JsonApiQueries } from '../types/json-api-queries';
import { parseJsonApiQuery } from '../utils/parse-json-api-query';
import { RequestIds } from '../types/request-ids';

type SuccessResponse = {
  success: boolean;
};

export class JsonApiConnectorService {
  private readonly baseUrl = '/api/v1' as const;
  private readonly httpClient: HttpClient;
  private readonly resourcePrefix: string;

  constructor(prefix: string = '') {
    this.httpClient = inject(HttpClient);
    this.resourcePrefix = prefix;
  }

  create<T>(route: string, resource: T, ...additionalResources: T[]): Observable<T | T[]> {
    const uri = this.getUri(route);

    if (additionalResources.length === 0) {
      return this.httpClient.post<T>(uri, resource)
        .pipe(catchError((err) => {
          throw new HttpException(err);
        }));
    }

    return forkJoin([resource, ...additionalResources].map((entry) => {
      return this.httpClient.post<T>(uri, entry)
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

  read<T>(route: string, ids: RequestIds | string, query?: JsonApiQueries): Observable<T> {
    const uri = this.getUri(this.replaceIds(route, ids)) + parseJsonApiQuery(query);

    return this.httpClient.get<T>(uri)
      .pipe(catchError((err) => {
        throw new HttpException(err);
      }));
  }

  update<T>(route: string, ids: RequestIds | string, data: T): Observable<boolean> {
    const uri = this.getUri(this.replaceIds(route, ids));

    return this.httpClient.patch<SuccessResponse>(uri, data)
      .pipe(
        catchError((err) => {
          throw new HttpException(err);
        }),
        switchMap((response) => of(response.success)),
      );
  }

  private replaceIds(route: string, ids: RequestIds | string): string {
    if (typeof ids === 'string') {
      route = route.replace(':id', ids);
    } else {
      for (const id in ids) {
        route = route.replace(`:${id}`, ids[id]);
      }
    }

    return route;
  }

  private getUri(route: string): string {
    let uri: string = this.baseUrl;

    if (this.resourcePrefix !== '') {
      uri += `/${this.resourcePrefix}`;
    }

    return uri + `/${route}`;
  }
}
