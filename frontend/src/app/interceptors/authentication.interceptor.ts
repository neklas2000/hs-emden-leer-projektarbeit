import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';

import { AuthenticationService } from '@Services/authentication.service';
import { Nullable } from '@Types';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private accessTokenSubject = new BehaviorSubject<Nullable<string>>(null);

  constructor(private readonly authentication: AuthenticationService) { }

  /**
   * @description
   * This http interceptor intercepts every outgoing http request and tries to set an bearer token
   * in the Authorization header. If no token is available the request will be immediately passed down
   * the interceptor chain. If a request is send with an invalid token and the api responds with the
   * status 401 - Unauthorized, the tokens will be refreshed and the request will be resend.
   *
   * @param req The http request to be intercepted.
   * @param next The next interceptor in an interceptor chain, or the real backend if there are no
   * further interceptors.
   * @returns The result of the next handler.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authentication.getAccessToken();

    if (accessToken) {
      request = this.addToken(request, accessToken);
    }

    return next.handle(request).pipe(catchError((error, caught) => {
      if (this.isUnauthorizedRequest(request, error)) {
        return this.handleUnauthorizedError(request, next);
      } else {
        return throwError(() => error);
      }
    }));
  }

  /**
   * @description
   * This function takes a http request object and an authorization token as the arguments. With
   * these arguments the request will be cloned and the headers will be populated with the header
   * `Authorization` and the token as the value.
   *
   * @param req The http request object.
   * @param token The token (either the access or the refresh token).
   * @returns The cloned and populated http request.
   */
  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * @description
   * This function checks if the error of the failed request has the status 401 - Unauthorized. First
   * it makes sure that the error has to be an instance of `HttpErrorResponse` and the failed request
   * is not on the route `/auth/login`, since there are no tokens required.
   *
   * @param request The http request which failed.
   * @param error The error which was caught while sending the request.
   * @returns `true`, if the status is 401 - Unauthorized and it is not a login request,
   * otherwise `false`.
   */
  private isUnauthorizedRequest(request: HttpRequest<any>, error: any): boolean {
    if (!(error instanceof HttpErrorResponse)) return false;
    if (request.url.includes('auth/login')) return false;

    return error.status === 401;
  }

  /**
   * @description
   * This function handles a http request in case an unauthorized exception has occurred. In case
   * the token pair is not being refreshed at the moment, an additional http request to refresh the
   * tokens is sent. In case the new http request was successful, the access token will be updated
   * internally and the originally intercepted request will be resend. In case the refresh request
   * fails, the user will be signed out and the error is thrown.
   * In case the token is already being refreshed at the moment, this function waits until a new
   * access token is available and resends the intercepted request.
   *
   * @param req The intercepted http request.
   * @param next The next interceptor in an interceptor chain, or the real backend if there are no
   * further interceptors.
   * @returns A http event as the result of handling the request.
   */
  private handleUnauthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.accessTokenSubject.next(null);

      return this.authentication.refreshTokens().pipe(
        switchMap((accessToken) => {
          this.isRefreshing = false;
          this.accessTokenSubject.next(accessToken);

          return next.handle(this.addToken(req, accessToken));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authentication.logout();

          return throwError(() => error);
        }),
      );
    } else {
      return this.accessTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addToken(req, token!));
        }),
      );
    }
  }
}
