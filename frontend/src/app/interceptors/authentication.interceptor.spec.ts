import { HttpInterceptorFn, HttpRequest, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of, take } from 'rxjs';

import { authenticationInterceptor } from './authentication.interceptor';
import { AuthenticationService } from '@Services/authentication.service';

describe('Interceptor: authenticationInterceptor', () => {
  let authentication: AuthenticationService;
  const executeIntercepter: HttpInterceptorFn = (...interceptorParameters) =>
      TestBed.runInInjectionContext(() => authenticationInterceptor(...interceptorParameters));

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        provideHttpClient(),
      ],
    });

    authentication = TestBed.inject(AuthenticationService);
  });

  it('should immediately call the next handler since no access token is available', (done) => {
    const request = 'I am a request' as any as HttpRequest<any>;
    const nextHandler = jasmine.createSpy().and.callFake((req) => of(req));
    const getAccessTokenSpy = spyOn(authentication, 'getAccessToken').and.returnValue(null);

    executeIntercepter(request, nextHandler).pipe(take(1)).subscribe((result) => {
      expect(getAccessTokenSpy).toHaveBeenCalled();
      expect(nextHandler).toHaveBeenCalledWith(request);
      expect(result).toEqual(request as any);

      done();
    });
  });
});
