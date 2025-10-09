import { Injectable } from '@angular/core';

import { BehaviorSubject, catchError, map, Observable, of, switchMap, take } from 'rxjs';

import { JsonApiConnector } from './json-api-connector';
import { omit } from '../utils/omit';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends JsonApiConnector<Entities.User> {
  private user: Entities.User | null = null;
  private readonly accessToken = new BehaviorSubject<string | null>(null);
  private readonly refreshToken = new BehaviorSubject<string | null>(null);
  private readonly loggedOut = new BehaviorSubject<boolean>(false);
  accessToken$: Observable<string | null>;
  refreshToken$: Observable<string | null>;
  loggedOut$: Observable<boolean>;

  constructor() {
    super('auth');

    this.accessToken$ = this.accessToken.asObservable();
    this.refreshToken$ = this.refreshToken.asObservable();
    this.loggedOut$ = this.loggedOut.asObservable();
  }

  register(user: InputTypes.PartialUser): Observable<Entities.User> {
    return this.create<ResponseTypes.Register>({
      route: 'register',
      data: {
        ...user,
      },
    }).pipe(take(1), switchMap((registerResponse) => {
      this.user = <Entities.User>registerResponse.user;
      this.accessToken.next(registerResponse.accessToken);
      this.refreshToken.next(registerResponse.refreshToken);

      return of(this.user);
    }));
  }

  login(
    emailAddress: string,
    password: string,
  ): Observable<Omit<ResponseTypes.Login, 'accessToken' | 'refreshToken'>> {
    return this.create<ResponseTypes.Login>({
      route: 'login',
      data: {
        emailAddress,
        password,
      },
    }).pipe(take(1), switchMap((loginResponse) => {
      this.user = <Entities.User>loginResponse.user;
      this.accessToken.next(loginResponse.accessToken);
      this.refreshToken.next(loginResponse.refreshToken);

      return of(omit(loginResponse, 'accessToken', 'refreshToken'));
    }));
  }

  logout(): Observable<boolean> {
    return this.create<boolean>({ route: 'logout', data: null })
      .pipe(take(1), switchMap((successful) => {
        if (successful) {
          this.user = null;
          this.accessToken.next(null);
          this.refreshToken.next(null);
          this.loggedOut.next(true);
        }

        return of(successful);
      }));
  }

  refreshTokens(): Observable<ResponseTypes.RefreshTokens> {
    return this.create<ResponseTypes.RefreshTokens>({ route: 'refresh', data: null })
      .pipe(take(1), map((refreshTokensResponse) => {
        this.user = <Entities.User>refreshTokensResponse.user;
        this.accessToken.next(refreshTokensResponse.accessToken);
        this.refreshToken.next(refreshTokensResponse.refreshToken);

        return refreshTokensResponse;
      }));
  }

  attemptLoginUsingCookies(): Observable<boolean> {
    return this.refreshTokens().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false)),
    );
  }

  getUser(): Entities.User | null {
    return this.user ?? null;
  }

  get isAuthenticated() {
    return this.user !== null;
  }
}
