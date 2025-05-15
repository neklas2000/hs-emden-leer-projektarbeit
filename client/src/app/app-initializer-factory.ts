import { inject } from '@angular/core';

import { map, Observable } from 'rxjs';

import { AuthenticationService } from './services/authentication.service';
import { AppSettingsService } from './services/app-settings.service';

export function appInitializerFactory(): Observable<boolean> {
  const authentication = inject(AuthenticationService);
  const appSettings = inject(AppSettingsService);

  return authentication.attemptLoginUsingCookies().pipe(map((isLoggedIn) => {
    if (isLoggedIn) {
      appSettings.loadInitialSettings(authentication.getUser()!.id);
    }

    return isLoggedIn;
  }));
}
