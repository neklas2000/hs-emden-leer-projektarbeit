import { Observable, asyncScheduler, scheduled } from 'rxjs';

export function promiseToObservable<T>(promise$: Promise<T>): Observable<T> {
	return scheduled(promise$, asyncScheduler);
}
