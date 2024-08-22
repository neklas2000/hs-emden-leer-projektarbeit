import { Injectable } from '@angular/core';

import { blobToDataURL } from 'blob-util';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityProviderService {
  constructor() {}

  get toBase64() {
    return function(blob: Blob): Observable<string> {
      return new Observable<string>((observer) => {
        blobToDataURL(blob)
          .then((base64) => {
            observer.next(base64);
          })
          .catch((err) => {
            observer.error(err);
          })
          .finally(() => {
            observer.complete();
          });
      });
    };
  }
}
