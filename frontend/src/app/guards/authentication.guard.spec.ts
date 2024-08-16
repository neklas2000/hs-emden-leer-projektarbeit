import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  provideRouter
} from '@angular/router';

import { Observable, of, take } from 'rxjs';

import { authenticationGuard } from '@Guards/authentication.guard';
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

  it('should create', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true, since the user is authenticated', () => {
    const isAuthenticatedSpy = spyOn(authentication, 'isAuthenticated').and.returnValue(true);
    const checkStatusSpy = spyOn(authentication, 'canRefreshTokensWithCookie');

    const result = executeGuard(
      null as any as ActivatedRouteSnapshot,
      null as any as RouterStateSnapshot,
    );

    expect(isAuthenticatedSpy).toHaveBeenCalled();
    expect(checkStatusSpy).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it('should return false, since the user is not authenticated', (done) => {
    const isAuthenticatedSpy = spyOn(authentication, 'isAuthenticated').and.returnValue(false);
    const checkStatusSpy = spyOn(authentication, 'canRefreshTokensWithCookie')
      .and.returnValue(of(false));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    (executeGuard(
      null as any as ActivatedRouteSnapshot,
      null as any as RouterStateSnapshot,
    ) as Observable<boolean>).pipe(take(1)).subscribe((result) => {
      expect(isAuthenticatedSpy).toHaveBeenCalled();
      expect(checkStatusSpy).toHaveBeenCalled();
      expect(navigateByUrlSpy).toHaveBeenCalledWith('/auth/login');
      expect(result).toBeFalsy();

      done();
    });
  });
});
