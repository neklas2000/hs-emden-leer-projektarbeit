import { Observable } from 'rxjs';

export function toBase64(blob: Blob): Observable<string> {
  return new Observable<string>((observer) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      observer.next(reader.result as string);
      observer.complete();
    };
    reader.onerror = (err) => {
      observer.error(err);
      observer.complete();
    };

    reader.readAsDataURL(blob);
  });
};
