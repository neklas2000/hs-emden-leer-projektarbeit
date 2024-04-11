import { Observable, take } from 'rxjs';

import { promiseToObservable } from './promise-to-oberservable';

describe('Util: promiseToObservable', () => {
	it('should turn a promise into an observable', (done) => {
		const source$ = Promise.resolve(true);
		const observable$ = promiseToObservable(source$);

		expect(source$).toBeInstanceOf(Promise);
		expect(observable$).toBeInstanceOf(Observable);

		observable$.pipe(take(1)).subscribe((result) => {
			expect(result).toBeTruthy();

			done();
		});
	});
});
