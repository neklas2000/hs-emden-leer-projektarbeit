import { Observable } from 'rxjs';

import { AuthenticationService } from '@Services/authentication.service';

type AppInitializerFactory = () => Observable<boolean>;

export function appInitializerFactory(authentication: AuthenticationService): AppInitializerFactory {
  return () => authentication.canRefreshTokensWithCookie();
}
