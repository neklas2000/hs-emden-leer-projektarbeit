import { HttpRequest, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of, take } from 'rxjs';

import { AuthenticationInterceptor } from './authentication.interceptor';
import { AuthenticationService } from '@Services/authentication.service';

describe('Interceptor: AuthenticationInterceptor', () => {
  let interceptor: AuthenticationInterceptor;
  let authentication: AuthenticationService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [AuthenticationInterceptor],
      providers: [
        AuthenticationService,
        provideHttpClient(),
      ],
    });

    interceptor = TestBed.inject(AuthenticationInterceptor);
    authentication = TestBed.inject(AuthenticationService);
  });

  it('should immediately call the next handler since no access token is available', (done) => {
    const request = 'I am a request' as any as HttpRequest<any>;
    const nextHandler = {
      handle: jasmine.createSpy().and.callFake((req) => of(req)),
    };
    const getAccessTokenSpy = spyOn(authentication, 'getAccessToken').and.returnValue(null);

    interceptor.intercept(request, nextHandler).pipe(take(1)).subscribe((result) => {
      expect(getAccessTokenSpy).toHaveBeenCalled();
      expect(nextHandler.handle).toHaveBeenCalledWith(request);
      expect(result).toEqual(request as any);

      done();
    });
  });
});
