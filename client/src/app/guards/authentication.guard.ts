import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

export const authenticationGuard: CanActivateFn = (
  _route,
  _state,
  auth = inject(AuthenticationService),
) => {
  return auth.isAuthenticated;
};
