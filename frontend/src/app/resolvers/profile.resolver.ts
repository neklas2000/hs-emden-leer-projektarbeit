import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { User } from '@Models/user';
import { ProfileService } from '@Services/profile.service';
import { Nullable } from '@Types';

export const profileResolver: ResolveFn<Observable<Nullable<User>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  profile: ProfileService = inject(ProfileService),
) => {
  return profile.read<User>();
};
