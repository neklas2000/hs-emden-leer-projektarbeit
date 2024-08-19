import { Injectable } from '@angular/core';

import { Observable, catchError, map, of, switchMap, take, throwError } from 'rxjs';

import { User } from '@Models/user';
import { JsonApiConnectorService } from '@Services/json-api-connector.service';
import { SessionStorageService } from '@Services/session-storage.service';
import { DeepPartial, Nullable } from '@Types';

/**
 * @description
 * This type represents the response data when refreshing the token pair.
 */
type TokensResponse = {
  accessToken: string;
  refreshToken: string;
};

/**
 * @description
 * This type extends the `TokensResponse` by an user object and it represents the response data
 * when a user signs in or registers.
 */
type TokensWithUserResponse = TokensResponse & {
  user: User;
};

/**
 * @description
 * This type represents the response received when a user signs out from the application.
 */
type LogoutResponse = {
  success: boolean;
};

/**
 * @description
 * This service provides the generic CRUD operations from the json api connector using the default
 * endpoint 'auth'.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends JsonApiConnectorService<User> {
  constructor(private readonly sessionStorage: SessionStorageService) {
    super('auth');
  }

  /**
   * @description
   * This function sends a request to the api to register a new user. The definition of that user,
   * inlcuding required credentials, is provided by an object and send as the requests payload.
   *
   * @param userData The definition of the user to be registered.
   * @returns `true`, if the new user was successfully registered.
   */
  register(userData: DeepPartial<User> & { password: string; email: string; }): Observable<true> {
    return this.create<TokensWithUserResponse>(
      'register',
      {
        ...userData,
      },
    ).pipe(
      take(1),
      map((response) => {
        this.sessionStorage.setUser(response.user.id);
        this.sessionStorage.setAccessToken(response.accessToken);
        this.sessionStorage.setRefreshToken(response.refreshToken);

        return true as const;
      }),
    );
  }

  /**
   * @description
   * This function sends a request to the api to login the user with the provided credentials. It
   * will return `true`, if the user could be signed in successfully.
   *
   * @param email The email address from the user.
   * @param password The password from the user.
   * @returns `true` if the login operation was successful.
   */
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

  /**
   * @description
   * This function sends a request to the api to signout the user. This will return an observable
   * representing the success of the logout operation and if successful all saved data will be
   * cleared.
   *
   * @returns `true` if the signout was successful, otherwise `false`.
   */
  logout(): Observable<boolean> {
    return this.create<LogoutResponse>('logout', {}).pipe(take(1), map((response) => {
      if (response.success) {
        this.clear();

        return true;
      }

      return false;
    }));
  }

  /**
   * @returns The stored user, otherwise `null`.
   */
  getUser(): Nullable<string> {
    return this.sessionStorage.getUser();
  }

  /**
   * @returns The stored access token, otherwise `null`.
   */
  getAccessToken(): Nullable<string> {
    return this.sessionStorage.getAccessToken();
  }

  /**
   * @returns The stored refresh token, otherwise `null`.
   */
  getRefreshToken(): Nullable<string> {
    return this.sessionStorage.getRefreshToken();
  }

  /**
   * @description
   * This function can be used to refresh the token pair, once the access token has expired.
   *
   * @returns The new access token.
   * @throws An error if there is no refresh token is available.
   */
  refreshTokens(): Observable<string> {
    if (!this.sessionStorage.getRefreshToken()) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.create<TokensResponse>('refresh', {})
      .pipe(
        take(1),
        switchMap((tokens) => {
          this.sessionStorage.setAccessToken(tokens.accessToken);
          this.sessionStorage.setRefreshToken(tokens.refreshToken);

          return tokens.accessToken;
        }),
      );
  }

  /**
   * @description
   * This function tries to refresh the access and refresh token since these are not present in the
   * service. If the user has cookies enabled the request will be automatically extended by them
   * and the api will, if the refresh token is still valid, refresh the pair of tokens and return
   * them here.
   *
   * @returns `true` if the token pair could be refreshed, otherwise `false`.
   */
  canRefreshTokensWithCookie(): Observable<boolean> {
    return this.create<TokensWithUserResponse>('refresh', {}).pipe(
      take(1),
      switchMap((tokens) => {
        this.sessionStorage.setAccessToken(tokens.accessToken);
        this.sessionStorage.setRefreshToken(tokens.refreshToken);
        this.sessionStorage.setUser(tokens.user?.id ?? '');

        return of(true);
      }),
      catchError((_) => {
        return of(false);
      }),
    )
  }

  /**
   * @description
   * This function checks if there is an authenticated user present and returns a boolean value
   * representing it's findings.
   *
   * @returns `true` if the user is authenticated, otherwise `false`.
   */
  isAuthenticated(): boolean {
    return this.sessionStorage.getUser() !== null;
  }

  /**
   * @description
   * This function clears the data stored in the session storage. It can be called after an user
   * signs out of the application or an user deleted his profile.
   */
  clear(): void {
    this.sessionStorage.clear();
  }
}
