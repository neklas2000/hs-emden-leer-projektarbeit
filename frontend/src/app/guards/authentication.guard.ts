import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { of, switchMap, take } from 'rxjs';

import { AuthenticationService } from '@Services/authentication.service';

/**
 * @description
 * This guard checks if the user is already authenticated in order to be eligible to access the
 * requested route. If the user isn't authenticated, yet, an attempt to refresh the users token pair
 * is started. This attempt requires the user to have cookies activated and he/she owns a still
 * valid refresh token.
 *
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @returns `true`, if the user is already authenticated or the token pair could be refreshed,
 * otherwise `false`.
 */
export const authenticationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  auth: AuthenticationService = inject(AuthenticationService),
  router: Router = inject(Router),
) => {
  if (auth.isAuthenticated()) return true;

  return auth.canRefreshTokensWithCookie()
    .pipe(take(1), switchMap((tokensRefreshed) => {
      if (!tokensRefreshed) {
        router.navigateByUrl('/auth/login');
      }

      return of(tokensRefreshed);
    }));
};
