import { Injectable } from '@angular/core';

import { WindowProviderService } from '@Services/window-provider.service';
import { Nullable } from '@Types';

const USER_KEY = 'auth-user';
const ACCESS_TOKEN_KEY = 'auth-access-token';
const REFRESH_TOKEN_KEY = 'auth-refresh-token';

/**
 * @description
 * This service wraps the session storage of a browser. It can be used to store authentication
 * information about the user, such as the users id and his/her token pair.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private window: Window;

  constructor(private readonly windowProvider: WindowProviderService) {
    this.window = this.windowProvider.getWindow();
  }

  /**
   * @description
   * This function clears all stored data. This could be used when a user signs out of the app.
   */
  clear(): void {
    this.window.sessionStorage.clear();
  }

  /**
   * @description
   * This function stores an user id inside the session storage of a browser.
   *
   * @param id The user id to be stored.
   */
  setUser(id: string): void {
    this.window.sessionStorage.setItem(USER_KEY, id);
  }

  /**
   * @description
   * This function tries to retrieve a stored user id. If it is present the id will be
   * returned, otherwise `null` is returned.
   *
   * @returns The stored user id or `null`.
   */
  getUser(): Nullable<string> {
    return this.window.sessionStorage.getItem(USER_KEY);
  }

  /**
   * @description
   * This function stores an access token inside the session storage of a browser.
   *
   * @param token The access token to be stored.
   */
  setAccessToken(token: string): void {
    this.window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  /**
   * @description
   * This function tries to retrieve a stored access token. If it is present the token will be
   * returned, otherwise `null` is returned.
   *
   * @returns The stored access token or `null`.
   */
  getAccessToken(): Nullable<string> {
    return this.window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * @description
   * This function stores a refresh token inside the session storage of a browser.
   *
   * @param token The refresh token to be stored.
   */
  setRefreshToken(token: string): void {
    this.window.sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  /**
   * @description
   * This function tries to retrieve a stored refresh token. If it is present the token will be
   * returned, otherwise `null` is returned.
   *
   * @returns The stored refresh token or `null`.
   */
  getRefreshToken(): Nullable<string> {
    return this.window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }
}
