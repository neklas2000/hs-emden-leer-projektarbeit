import { HttpClient, HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, throwError } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

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

function isUnauthorizedRequest(request: HttpRequest<any>, error: any): boolean {
  if (!(error instanceof HttpErrorResponse)) return false;
  if (request.url.includes('auth/login')) return false;

  return error.status === 401;
}
