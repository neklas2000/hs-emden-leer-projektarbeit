import { HttpEvent, HttpEventType, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

import { of, switchMap } from 'rxjs';

export const jsonApiInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next) => {
  let data;

  if (req.body && Object.hasOwn(req.body, 'data')) {
    data = req.body.data;
  } else {
    data = req.body ?? null;
  }

  return next(req.clone({
    body: {
      data,
    },
  })).pipe(switchMap((response: HttpEvent<any>) => {
    if (response.type === HttpEventType.Response) {
      if (!response.body) return of(response);

      return of(response.clone({
        body: response.body.data,
      }));
    }

    return of(response);
  }));
};
