import { HttpInterceptorFn } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { credentialsInterceptor } from '@Interceptors/credentials.interceptor';

describe('Interceptor: credentialsInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => credentialsInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should create', () => {
    expect(interceptor).toBeTruthy();
  });
});
