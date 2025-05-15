import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { JsonApiOptions, parseJsonApiOptions } from '../common/parse-json-api-options';
import { parseRequestIds, RequestIds } from '../common/parse-request-ids';

export enum ProjectRole {
	Contributor = 'contributor',
	Tutor = 'tutor',
}

type SubRouteOptions = {
  route?: string;
  ids?: string | number | RequestIds;
  /**
   * @default 1
   */
  version?: number;
};

type ReadOptions = JsonApiOptions & SubRouteOptions;
type DeleteOptions = Partial<Pick<JsonApiOptions, 'filters'>> & SubRouteOptions;

type CreateOptions<T> = JsonApiOptions & SubRouteOptions & {
  data: Partial<T> | null;
};

type UpdateMany<T> = {
  [id: UUID]: T;
};

type UpdateOptions<T> = JsonApiOptions & SubRouteOptions & {
  data: Partial<T>;
};

export abstract class JsonApiConnector<T> {
  protected readonly client: HttpClient;
  private readonly baseRoute = '/api/v:version';
  private readonly defaultVersion = 1;

  constructor(private readonly path: string) {
    this.client = inject(HttpClient);
  }

  create<T_Return = T>(createOptions: CreateOptions<T>): Observable<T_Return>;
  create<T_Return = T>(createOptions: CreateOptions<T[]>): Observable<T_Return[]>;
  create<T_Return = T>(createOptions: CreateOptions<T | T[]>): Observable<T_Return | T_Return[]> {
    const url = this.buildPath(createOptions);

    return this.client.post<T_Return | T_Return[]>(url, createOptions.data);
  }

  read<T_RETURN = T>(readOptions: ReadOptions): Observable<T_RETURN> {
    return this.client.get<T_RETURN>(this.buildPath(readOptions));
  }

  readAll<T_RETURN = T>(readOptions: Omit<ReadOptions, 'ids'>): Observable<T_RETURN[]> {
    return this.client.get<T_RETURN[]>(this.buildPath(readOptions));
  }

  update<T_RETURN = T>(updateOptions: UpdateOptions<T>): Observable<T_RETURN>;
  update<T_RETURN = T>(updateOptions: UpdateOptions<UpdateMany<T>>): Observable<UpdateMany<T_RETURN>>;
  update<T_RETURN = T>(updateOptions: UpdateOptions<T | UpdateMany<T>>): Observable<T_RETURN | UpdateMany<T_RETURN>> {
    const url = this.buildPath(updateOptions);

    return this.client.patch<T_RETURN | UpdateMany<T_RETURN>>(url, updateOptions.data);
  }

  delete(deleteOptions: DeleteOptions): Observable<boolean> {
    return this.client.delete<boolean>(this.buildPath(deleteOptions));
  }

  private buildPath(options: JsonApiOptions & SubRouteOptions): string {
    let url = this.baseRoute.replace(':version', String(options?.version ?? this.defaultVersion));
    url += `/${this.path}`;
    const parsedSubRoute = parseRequestIds(options.route, options.ids);

    if (parsedSubRoute) {
      url += `/${parsedSubRoute}`;
    }

    url += parseJsonApiOptions(options);

    return url;
  }
}
