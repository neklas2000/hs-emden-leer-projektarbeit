import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { authenticationGuard } from './authentication.guard';
import { AuthenticationService } from '@Services/authentication.service';

describe('Guard: authenticationGuard', () => {
  let authentication: AuthenticationService;
  let router: Router;
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authenticationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        provideHttpClient(),
        provideRouter([]),
      ],
    });

    authentication = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true, since the user is authenticated', () => {
    const isAuthenticatedSpy = spyOn(authentication, 'isAuthenticated').and.returnValue(true);
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    const result = executeGuard(
      null as any as ActivatedRouteSnapshot,
      null as any as RouterStateSnapshot,
    );

    expect(isAuthenticatedSpy).toHaveBeenCalled();
    expect(navigateByUrlSpy).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it('should return false, since the user is not authenticated', () => {
    const isAuthenticatedSpy = spyOn(authentication, 'isAuthenticated').and.returnValue(false);
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    const result = executeGuard(
      null as any as ActivatedRouteSnapshot,
      null as any as RouterStateSnapshot,
    );

    expect(isAuthenticatedSpy).toHaveBeenCalled();
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/auth/login');
    expect(result).toBeFalsy();
  });
});
