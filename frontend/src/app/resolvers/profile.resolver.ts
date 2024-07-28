import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { User } from '@Models/user';
import { ProfileService } from '@Services/profile.service';
import { Nullable } from '@Types';

/**
 * @description
 * This resolver resolves the profile of the authenticated user.
 *
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @param profile An automatically injected service to access the resource "profile".
 * @returns An observable which resolves to the correct profile or `null`, if it couldn't be
 * found.
 */
export const profileResolver: ResolveFn<Observable<Nullable<User>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  profile: ProfileService = inject(ProfileService),
) => {
  return profile.read<User>();
};
