import { Observable } from 'rxjs';

export function promiseToObservable<T_1, T_2 = T_1>(
	promise$: Promise<T_1>,
	successHandler?: (result: T_1) => T_1 | T_2,
	errorHandler?: (exception: any) => any,
): Observable<T_1 | T_2> {
	return new Observable<T_1 | T_2>((subscriber) => {
		promise$
			.then((result) => {
				if (successHandler) {
					subscriber.next(successHandler(result));
				} else {
					subscriber.next(result);
				}
			})
			.catch((exception) => {
				if (errorHandler) {
					subscriber.error(errorHandler(exception));
				} else {
					subscriber.error(exception);
				}
			})
			.finally(() => {
				subscriber.complete();
			});
	});
}
