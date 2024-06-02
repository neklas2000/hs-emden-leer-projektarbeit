import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { of, switchMap, take } from 'rxjs';

import { AuthenticationService } from '@Services/authentication.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (authenticationService.isAuthenticated()) return true;

  return authenticationService.checkStatus().pipe(take(1), switchMap((authStatus) => {
    if (!authStatus) {
      router.navigateByUrl('/auth/login');
    }

    return of(authStatus);
  }));
};
