import { HttpInterceptorFn } from '@angular/common/http';

/**
 * @description
 * This http interceptor intercepts every outgoing http request and sets the option
 * `withCredentials` to `true`. This automatically adds any credential related data to the http
 * request.
 *
 * @param req The http request to be intercepted.
 * @param next The next interceptor in an interceptor chain, or the real backend if there are no
 * further interceptors.
 * @returns The result of the next handler.
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const withCredentialsReq = req.clone({
    withCredentials: true,
  });

  return next(withCredentialsReq);
};
