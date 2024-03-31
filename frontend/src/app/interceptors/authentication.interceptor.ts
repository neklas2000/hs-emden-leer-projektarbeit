import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const authenticationInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
) => {
  const accessToken = inject(AuthenticationService).getAccessToken();

  if (accessToken === null) return next(request);

  const authorizedRequest = request.clone({
    headers: request.headers.set('Authorization', `Bearer ${accessToken}`),
  });

  return next(authorizedRequest);
};
