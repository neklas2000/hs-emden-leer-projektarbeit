import { Observable, take } from 'rxjs';

import { promiseToObservable } from '@Utils/promise-to-oberservable';

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

	it('should turn a promise into an observable with a error handler', (done) => {
		const source$ = async () => {
			throw new Error('exception');
		};

		promiseToObservable(source$(), null, (exception: Error) => {
			return {
				message: exception.message,
			};
		})
			.pipe(take(1))
			.subscribe({
				error: (err) => {
					expect(err).toEqual({
						message: 'exception',
					});

					done();
				},
			});
	});
});
