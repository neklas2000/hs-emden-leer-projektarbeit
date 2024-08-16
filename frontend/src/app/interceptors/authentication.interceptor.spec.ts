import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AuthenticationInterceptor } from '@Interceptors/authentication.interceptor';
import { AuthenticationService } from '@Services/authentication.service';

describe('Interceptor: AuthenticationInterceptor', () => {
  let interceptor: AuthenticationInterceptor;
  let authentication: AuthenticationService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationInterceptor,
        AuthenticationService,
        provideHttpClient(),
      ],
    });

    interceptor = TestBed.inject(AuthenticationInterceptor);
    authentication = TestBed.inject(AuthenticationService);
  });

  it('should create', () => {
		expect(interceptor).toBeTruthy();
	});
});
