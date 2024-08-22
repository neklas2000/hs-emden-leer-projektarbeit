import { HttpInterceptorFn } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of, take } from 'rxjs';

import { credentialsInterceptor } from '@Interceptors/credentials.interceptor';

describe('Interceptor: credentialsInterceptor', () => {
  const runInterceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => credentialsInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should create', () => {
    expect(runInterceptor).toBeTruthy();
  });

  it('should clone the request and extend the headers', (done) => {
    const request: any = {
      withCredentials: false,
    };
    request.clone = jasmine.createSpy().and.callFake((opts: any) => {
      const cloned = { ...request };

      for (const opt in opts) {
        cloned[opt] = opts[opt];
      }

      return of(cloned);
    });

    runInterceptor(request, jasmine.createSpy().and.callFake((req) => req))
      .pipe(take(1))
      .subscribe((newRequest: any) => {
        expect(newRequest).toEqual(jasmine.objectContaining({
          withCredentials: true,
        }));

        done();
      });
  });
});
