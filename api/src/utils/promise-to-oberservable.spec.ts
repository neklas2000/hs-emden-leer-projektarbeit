import { Observable, take } from 'rxjs';

import { promiseToObservable } from './promise-to-oberservable';

type ChangedSuccessResponse = {
	success: boolean;
};

describe('Util: promiseToObservable', () => {
	it('should turn a promise into an observable without any handlers', (done) => {
		const source$ = Promise.resolve(true);
		const observable$ = promiseToObservable(source$);

		expect(source$).toBeInstanceOf(Promise);
		expect(observable$).toBeInstanceOf(Observable);

		observable$.pipe(take(1)).subscribe((result) => {
			expect(result).toBeTruthy();

			done();
		});
	});

	it('should turn a promise into an observable with a success handler', (done) => {
		const source$ = Promise.resolve(true);
		const successHandler = jest.fn((result: boolean) => ({ success: result }));
		const observable$ = promiseToObservable<boolean, ChangedSuccessResponse>(
			source$,
			successHandler,
		) as Observable<ChangedSuccessResponse>;

		expect(source$).toBeInstanceOf(Promise);
		expect(observable$).toBeInstanceOf(Observable);

		observable$.pipe(take(1)).subscribe((result) => {
			expect(successHandler).toHaveBeenCalledWith(true);
			expect(result).toEqual({
				success: true,
			});

			done();
		});
	});

	it('should turn a promise into an observable with an error handler', (done) => {
		const source$ = Promise.reject('exception');
		const errorHandler = jest.fn((exception: string) => ({
			message: exception,
		}));
		const observable$ = promiseToObservable(
			source$,
			undefined,
			errorHandler,
		);

		expect(source$).toBeInstanceOf(Promise);
		expect(observable$).toBeInstanceOf(Observable);

		observable$.pipe(take(1)).subscribe({
			error: (exception) => {
				expect(errorHandler).toHaveBeenCalledWith('exception');
				expect(exception).toEqual({
					message: 'exception',
				});

				done();
			},
		});
	});
});
