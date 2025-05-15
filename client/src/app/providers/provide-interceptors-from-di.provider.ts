import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ClassProvider } from '@angular/core';

import { AuthenticationInterceptor } from '../interceptors/authentication.interceptor';

export function provideInterceptorsFromDi(): ClassProvider {
  return {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthenticationInterceptor,
    multi: true,
  };
}
