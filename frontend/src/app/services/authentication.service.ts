import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as crypto from 'crypto-js';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, take } from 'rxjs';

import { Nullable } from '../types/nullable';
import { User } from '../models/user';
import { JsonApiDatastore } from './json-api-datastore.service';
import { HttpException } from '../types/http-exception';

type TokensResponse = {
  accessToken: string;
  refreshToken: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user$!: Observable<Nullable<User>>;

  private user: BehaviorSubject<Nullable<User>> = new BehaviorSubject<Nullable<User>>(null);
  private accessToken: Nullable<string> = null;
  private refreshToken: Nullable<string> = null;
  private refreshing: boolean = false;

  constructor(
    private readonly jsonApiDatastore: JsonApiDatastore,
  ) {
    this.user$ = this.user.asObservable();
  }

  login(email: string, password: string): Observable<boolean | HttpException> {
    const hashedPassword = crypto.SHA256(password).toString(crypto.enc.Hex);

    return this.jsonApiDatastore.POST<TokensResponse>(
      'auth/login',
      {
        email,
        password: hashedPassword,
      }
    ).pipe(
      take(1),
      map((response) => {
        this.accessToken = response.accessToken;
        this.refreshToken = response.refreshToken;

        return true;
      }),
      catchError((err, caught) => {
        return of(new HttpException(err));
      })
    );
  }

  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.user.next(null);
  }

  getAccessToken(): Nullable<string> {
    return this.accessToken;
  }

  getRefreshToken(): Nullable<string> {
    return this.refreshToken;
  }

  refreshTokens(request: HttpRequest<any>, next: HttpHandlerFn) {
    if (!this.refreshToken || this.refreshing) return next(request);

    this.refreshing = true;

    return this.jsonApiDatastore.POST<TokensResponse>('auth/refresh', {})
      .pipe(
        take(1),
        switchMap((tokens, index) => {
          this.refreshToken = tokens.refreshToken;
          this.accessToken = tokens.accessToken;
          this.refreshing = false;

          return next(request.clone({
            headers: request.headers.set('Authorization', `Bearer ${this.accessToken}`),
          }));
        })
      );
  }
}
