import { Injectable } from '@angular/core';

import { Nullable } from '@Types';

const USER_KEY = 'auth-user';
const ACCESS_TOKEN_KEY = 'auth-access-token';
const REFRESH_TOKEN_KEY = 'auth-refresh-token';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  clear(): void {
    window.sessionStorage.clear();
  }

  setUser(id: string): void {
    window.sessionStorage.setItem(USER_KEY, id);
  }

  getUser(): Nullable<string> {
    return window.sessionStorage.getItem(USER_KEY);
  }

  setAccessToken(token: string): void {
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  getAccessToken(): Nullable<string> {
    return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): Nullable<string> {
    return window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }
}
