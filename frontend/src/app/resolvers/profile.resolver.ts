import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { User } from '@Models/user';
import { ProfileService } from '@Services/profile.service';

export const profileResolver: ResolveFn<Observable<User>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  profileService: ProfileService = inject(ProfileService),
) => {
  return profileService.read<User>();
};
