import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as crypto from 'crypto-js';
import { BehaviorSubject, Observable, map, switchMap, take } from 'rxjs';

import { JsonApiConnectorService } from './json-api-connector.service';
import { User } from '@Models/user';
import { DeepPartial, Nullable } from '@Types';

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
export class AuthenticationService extends JsonApiConnectorService {
  user$!: Observable<Nullable<User>>;

  private user: BehaviorSubject<Nullable<User>> = new BehaviorSubject<Nullable<User>>(null);
  private accessToken: Nullable<string> = null;
  private refreshToken: Nullable<string> = null;
  private refreshing: boolean = false;

  constructor() {
    super('auth');

    this.user$ = this.user.asObservable();
  }

  register(userData: DeepPartial<User> & { password: string; email: string; }): Observable<true> {
    const { password } = userData;
    const hashedPassword = crypto.SHA256(password).toString(crypto.enc.Hex);

    return this.create<DeepPartial<User>, TokensWithUserResponse>(
      'register',
      {
        ...userData,
        password: hashedPassword,
      },
    ).pipe(
      take(1),
      map((response) => {
        this.accessToken = response.accessToken;
        this.refreshToken = response.refreshToken;
        this.user.next(response.user);

        return true as const;
      }),
    );
  }

  login(email: string, password: string): Observable<true> {
    const hashedPassword = crypto.SHA256(password).toString(crypto.enc.Hex);

    return this.create<DeepPartial<User>, TokensWithUserResponse>(
      'login',
      {
        email,
        password: hashedPassword,
      },
    ).pipe(
      take(1),
      map((response) => {
        this.accessToken = response.accessToken;
        this.refreshToken = response.refreshToken;
        this.user.next(response.user);

        return true;
      }),
    );
  }

  logout(): Observable<boolean> {
    return this.create<any, LogoutResponse>('logout', {}).pipe(take(1), map((response) => {
      if (response.success) {
        this.accessToken = null;
        this.refreshToken = null;
        this.user.next(null);

        return true;
      }

      return false;
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

    return this.create<any, TokensResponse>('refresh', {})
      .pipe(
        take(1),
        switchMap((tokens, index) => {
          this.refreshToken = tokens.refreshToken;
          this.accessToken = tokens.accessToken;
          this.refreshing = false;

          return next(request.clone({
            headers: request.headers.set('Authorization', `Bearer ${this.accessToken}`),
          }));
        }),
      );
  }

  isAuthenticated(): boolean {
    return this.user.value !== null;
  }
}
