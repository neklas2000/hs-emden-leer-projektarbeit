import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

import { Observable, of, switchMap, take } from 'rxjs';

import { CachingService } from '@Services/caching.service';

export const layoutLogoResolver: ResolveFn<Observable<string>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  cache: CachingService = inject(CachingService),
) => {
  return cache.logo$.pipe(
    take(1),
    switchMap((logo) => {
      if (logo !== null) return of(logo);

      return new Promise<string>((resolve, reject) => {
        fetch('/assets/hsel-logo.svg')
          .then((response) => response.text())
          .then((svgText) => {
            let modifiedSvg = svgText
              .replace(
                '<svg',
                '<svg style="width: fit-content;" '
              )
              .replaceAll(
                'style="fill:#575756',
                'style="fill:currentColor'
              );
            cache.storeLogo(modifiedSvg);

            resolve(modifiedSvg);
          })
          .catch((err) => reject(err));
      });
    }),
  );
};
