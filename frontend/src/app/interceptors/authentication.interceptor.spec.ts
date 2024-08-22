import { HttpErrorResponse, HttpRequest, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthenticationInterceptor } from '@Interceptors/authentication.interceptor';
import { AuthenticationService } from '@Services/authentication.service';
import { of, take, throwError } from 'rxjs';

describe('Interceptor: AuthenticationInterceptor', () => {
  let interceptor: AuthenticationInterceptor;
  let authentication: AuthenticationService;
  let router: Router;
  let request: HttpRequest<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationInterceptor,
        AuthenticationService,
        provideHttpClient(),
        provideRouter([]),
      ],
    });

    interceptor = TestBed.inject(AuthenticationInterceptor);
    authentication = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    request = new HttpRequest('GET', '/api/v1/resource');
  });

  it('should create', () => {
		expect(interceptor).toBeTruthy();
	});

  describe('intercept(HttpRequest<any>, HttpHandler): Observable<HttpEvent<any>>', () => {
    it('should add an access token and successfully perform the request', (done) => {
      spyOn(authentication, 'getAccessToken').and.returnValue('valid-access-token');
      spyOn(request, 'clone').and.callThrough();
      const resource = {} as any;

      interceptor.intercept(request, {
        handle: jasmine.createSpy().and.callFake((_) => of(resource)),
      }).pipe(take(1)).subscribe((result) => {
        expect(request.clone).toHaveBeenCalled();
        expect(result).toEqual(resource);

        done();
      });
    });

    it('should not set an access token and handle an unauthorized request from a random resource', (done) => {
      spyOn(authentication, 'getAccessToken').and.returnValue(null);
      spyOn(authentication, 'refreshTokens').and.returnValue(of('new-access-token'));
      spyOn(request, 'clone');
      const resource = {} as any;
      const error = throwError(() => new HttpErrorResponse({ status: 401 }));
      const nextHandler = jasmine.createSpy().and.returnValues(error, of(resource))

      interceptor.intercept(request, { handle: nextHandler })
        .pipe(take(1))
        .subscribe((result) => {
          expect(authentication.refreshTokens).toHaveBeenCalled();
          expect(request.clone).toHaveBeenCalledTimes(1);
          expect(result).toEqual(resource);

          done();
        });
    });

    it('handle an unauthorized request and logout the user, since refreshing the tokens failed', (done) => {
      spyOn(authentication, 'getAccessToken').and.returnValue(null);
      spyOn(authentication, 'refreshTokens').and.returnValue(throwError(() => new Error('Failed to refresh tokens')));
      spyOn(authentication, 'logout');
      spyOn(request, 'clone');
      const error = throwError(() => new HttpErrorResponse({ status: 401 }));
      const nextHandler = jasmine.createSpy().and.returnValue(error);

      interceptor.intercept(request, { handle: nextHandler })
        .pipe(take(1))
        .subscribe({
          error: (error) => {
            expect(authentication.refreshTokens).toHaveBeenCalled();
            expect(request.clone).not.toHaveBeenCalled();
            expect(authentication.logout).toHaveBeenCalled();
            expect(error.message).toEqual('Failed to refresh tokens');

            done();
          },
        });
    });

    it('should let the request wait until a new token as arrived', (done) => {
      interceptor['isRefreshing'] = true;
      spyOn(authentication, 'getAccessToken').and.returnValue(null);
      spyOn(authentication, 'refreshTokens');
      spyOn(request, 'clone');
      const resource = {} as any;
      const error = throwError(() => new HttpErrorResponse({ status: 401 }));
      const nextHandler = jasmine.createSpy().and.returnValues(error, of(resource));

      interceptor.intercept(request, { handle: nextHandler })
        .pipe(take(1))
        .subscribe((result) => {
          expect(authentication.refreshTokens).not.toHaveBeenCalled();
          expect(request.clone).toHaveBeenCalled();
          expect(result).toEqual(resource);

          done();
        });

      interceptor['accessTokenSubject'].next('access-token');
    });

    it('should redirect to the login page, since the request was sent as a refresh request already', (done) => {
      spyOn(authentication, 'getAccessToken').and.returnValue(null);
      spyOn(router, 'navigateByUrl');
      const error = new HttpErrorResponse({ status: 401 });
      const error$ = throwError(() => error);
      const nextHandler = jasmine.createSpy().and.returnValue(error$);

      interceptor.intercept(request.clone({ url: '/auth/refresh' }), { handle: nextHandler })
        .pipe(take(1))
        .subscribe({
          error: (err) => {
            expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/login');
            expect(err).toEqual(error);

            done();
          },
        });
    });

    it('should pass through the error, since it is not an unauthorized request', (done) => {
      spyOn(authentication, 'getAccessToken').and.returnValue(null);
      spyOn(router, 'navigateByUrl');
      const error = new Error('An error occurred');
      const error$ = throwError(() => error);
      const nextHandler = jasmine.createSpy().and.returnValue(error$);

      interceptor.intercept(request, { handle: nextHandler })
        .pipe(take(1))
        .subscribe({
          error: (err) => {
            expect(router.navigateByUrl).not.toHaveBeenCalled();
            expect(err).toEqual(error);

            done();
          },
        });
    });

    it('should pass through the error, since it was a login request', (done) => {
      spyOn(authentication, 'getAccessToken').and.returnValue(null);
      spyOn(router, 'navigateByUrl');
      const error = new HttpErrorResponse({ status: 401 });
      const error$ = throwError(() => error);
      const nextHandler = jasmine.createSpy().and.returnValue(error$);

      interceptor.intercept(request.clone({ url: '/auth/login' }), { handle: nextHandler })
        .pipe(take(1))
        .subscribe({
          error: (err) => {
            expect(router.navigateByUrl).not.toHaveBeenCalled();
            expect(err).toEqual(error);

            done();
          },
        });
    });
  });
});
