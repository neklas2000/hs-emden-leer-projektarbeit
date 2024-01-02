import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, forkJoin } from 'rxjs';

import { BaseModel } from '../models/base-model';
import { Nullable } from '../types/nullable';

type JsonApiQueries = {
  includes?: string[];
  sparseFieldsets?: {
    [table: string]: string[];
  };
  filters?: {
    [field: string]: string | number | boolean;
  }
};

@Injectable({
  providedIn: 'root'
})
export class JsonApiDatastore {
  constructor(private readonly http: HttpClient) {}

  loadAll<T extends BaseModel>(
    model: typeof BaseModel,
    query?: JsonApiQueries,
  ): Observable<T[]> {
    if (!query || (!query.filters && !query.includes && !query.sparseFieldsets)) {
      return this.GET<T[]>(model.ROUTES.LOAD_ALL);
    }

    return this.GET<T[]>(`${model.ROUTES.LOAD_ALL}?${this.parseJsonApiQuery(query)}`);
  }

  load<T extends BaseModel>(
    model: typeof BaseModel,
    id: Nullable<string | number>,
    query?: JsonApiQueries,
  ): Nullable<Observable<T>> {
    if (!id) return null;

    const basePath = model.ROUTES.LOAD.replace(':id', String(id));

    if (!query || (!query.filters && !query.includes && !query.sparseFieldsets)) {
      return this.GET<T>(basePath);
    }

    return this.GET<T>(`${basePath}?${this.parseJsonApiQuery(query)}`);
  }

  add<T extends BaseModel>(model: typeof BaseModel, ...data: T[]): Observable<T[]> {
    return forkJoin(data.map((entry) => this.POST<T>(model.ROUTES.ADD, entry)));
  }

  private GET<T>(url: string): Observable<T> {
    return this.http.get<T>(`/api/v1/${url}`);
  }

  private POST<T>(url: string, payload: any): Observable<T> {
    return this.http.post<T>(url, payload);
  }

  private parseJsonApiQuery(query: JsonApiQueries): string {
    let queries = [];

    if (query.includes) {
      queries.push(`include=${query.includes.join(',')}`);
    }

    if (query.sparseFieldsets) {
      for (const table in query.sparseFieldsets) {
        queries.push(
          `fields[${table}]=${query.sparseFieldsets[table].join(',')}`
        );
      }
    }

    if (query.filters) {
      for (const field in query.filters) {
        queries.push(`filter[${field}]=${query.filters[field]}`);
      }
    }

    return queries.join('&');
  }
}
