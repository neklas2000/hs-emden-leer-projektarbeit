import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, map, of, switchMap, take } from 'rxjs';

import { JsonApiConnectorService } from './json-api-connector.service';
import { User } from '@Models/user';
import { DeepPartial, Nullable } from '@Types';
import { SessionStorageService } from './session-storage.service';

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
export class AuthenticationService extends JsonApiConnectorService<User> {
  private refreshing: boolean = false;

  constructor(private readonly sessionStorage: SessionStorageService) {
    super('auth');
  }

  register(userData: DeepPartial<User> & { password: string; email: string; }): Observable<true> {
    return this.create<TokensWithUserResponse>(
      'register',
      {
        ...userData,
      },
    ).pipe(
      take(1),
      map((response) => {
        this.sessionStorage.setUser(response.user.id ?? '');
        this.sessionStorage.setAccessToken(response.accessToken);
        this.sessionStorage.setRefreshToken(response.refreshToken);

        return true as const;
      }),
    );
  }

  login(email: string, password: string): Observable<true> {
    return this.create<TokensWithUserResponse>(
      'login',
      {
        email,
        password,
      },
    ).pipe(
      take(1),
      map((response) => {
        this.sessionStorage.setUser(response.user.id ?? '');
        this.sessionStorage.setAccessToken(response.accessToken);
        this.sessionStorage.setRefreshToken(response.refreshToken);

        return true;
      }),
    );
  }

  logout(): Observable<boolean> {
    return this.create<LogoutResponse>('logout', {}).pipe(take(1), map((response) => {
      if (response.success) {
        this.sessionStorage.clear();

        return true;
      }

      return false;
    }));
  }

  getUser(): Nullable<string> {
    return this.sessionStorage.getUser();
  }

  getAccessToken(): Nullable<string> {
    return this.sessionStorage.getAccessToken();
  }

  getRefreshToken(): Nullable<string> {
    return this.sessionStorage.getRefreshToken();
  }

  refreshTokens(request: HttpRequest<any>, next: HttpHandlerFn) {
    if (!this.sessionStorage.getRefreshToken() || this.refreshing) return next(request);

    this.refreshing = true;

    return this.create<TokensResponse>('refresh', {})
      .pipe(
        take(1),
        switchMap((tokens, index) => {
          this.refreshing = false;
          this.sessionStorage.setAccessToken(tokens.accessToken);
          this.sessionStorage.setRefreshToken(tokens.refreshToken);

          return next(request.clone({
            headers: request.headers.set('Authorization', `Bearer ${tokens.accessToken}`),
          }));
        }),
      );
  }

  checkStatus(): Observable<boolean> {
    return this.create<TokensResponse>('status', {}).pipe(
      take(1),
      switchMap((tokens) => {
        this.sessionStorage.setAccessToken(tokens.accessToken);
        this.sessionStorage.setRefreshToken(tokens.refreshToken);

        return of(true);
      }),
      catchError((err) => {
        return of(false);
      }),
    )
  }

  isAuthenticated(): boolean {
    return this.sessionStorage.getUser() !== null;
  }
}
