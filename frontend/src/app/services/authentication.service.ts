import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as crypto from 'crypto-js';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, take } from 'rxjs';

import { JsonApiDatastore } from './json-api-datastore.service';
import { User } from '@Models/user';
import { Nullable } from '@Types';
import { HttpException } from '@Utils/http-exception';

type TokensResponse = {
  accessToken: string;
  refreshToken: string;
};

type TokensWithUserResponse = TokensResponse & {
  user: User;
};

type LogoutResponse = {
  success: boolean;
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

    return this.jsonApiDatastore.POST<TokensWithUserResponse>(
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
        this.user.next(response.user);

        return true;
      }),
      catchError((err, caught) => {
        return of(new HttpException(err));
      })
    );
  }

  logout(): Observable<boolean> {
    return this.jsonApiDatastore.POST<LogoutResponse>('auth/logout', {})
      .pipe(take(1), switchMap((result) => {
        if (result.success === true) {
          this.accessToken = null;
          this.refreshToken = null;
          this.user.next(null);

          return of(true);
        }

        return of(false);
      }));
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

  isAuthenticated(): boolean {
    return this.user.value !== null;
  }
}
