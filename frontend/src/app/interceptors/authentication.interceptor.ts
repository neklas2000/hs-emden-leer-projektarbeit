import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, throwError } from 'rxjs';

import { AuthenticationService } from '@Services/authentication.service';

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
export const authenticationInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
) => {
  const authenticationService = inject(AuthenticationService);
  const accessToken = authenticationService.getAccessToken();

  if (accessToken === null) return next(request);
  if (request.url.includes('auth/refresh')) {
    const refreshToken = authenticationService.getRefreshToken();

    if (refreshToken === null) return next(request);

    return next(request.clone({
      headers: request.headers.set('Authorization', `Bearer ${refreshToken}`),
    }));
  }

  const authorizedRequest = request.clone({
    headers: request.headers.set('Authorization', `Bearer ${accessToken}`),
  });

  return next(authorizedRequest).pipe(catchError((err, caught) => {
    if (isUnauthorizedRequest(authorizedRequest, err)) {
      return authenticationService.refreshTokens(request, next);
    }

    return throwError(() => err);
  }));
};

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
function isUnauthorizedRequest(request: HttpRequest<any>, error: any): boolean {
  if (!(error instanceof HttpErrorResponse)) return false;
  if (request.url.includes('auth/login')) return false;

  return error.status === 401;
}
