import { Observable } from 'rxjs';

type OnSuccessHandler<T_IN, T_OUT> = (value: T_IN) => T_OUT;
type OnErrorHandler<T_IN, T_OUT> = (error: T_IN) => T_OUT;

export function promiseToObervable<T_INPUT, T_ERROR = any, T_RETURN = T_INPUT>(
	promise$: Promise<T_INPUT>,
	onSuccess: OnSuccessHandler<T_INPUT, T_RETURN> = (value) => <any>value,
	onError: OnErrorHandler<any, T_ERROR> = (error) => error,
): Observable<T_RETURN> {
	return new Observable<T_RETURN>((subscriber) => {
		promise$
			.then((result) => {
				subscriber.next(onSuccess(result));
			})
			.catch((error) => {
				subscriber.error(onError(error));
			})
			.finally(() => {
				subscriber.complete();
			});
	});
}
