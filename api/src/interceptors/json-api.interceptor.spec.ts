import { of, take } from 'rxjs';

import { JsonApiInterceptor } from '@Interceptors/json-api.interceptor';

describe('Interceptor: JsonApiInterceptor', () => {
	let interceptor: JsonApiInterceptor;

	beforeEach(() => {
		interceptor = new JsonApiInterceptor();
	});

	it('should create', () => {
		expect(interceptor).toBeTruthy();
	});

	describe('intercept(ExecutionContext, CallHandler<any>): Observable<any>', () => {
		it('should return an object with data null, since data was already null', (done) => {
			interceptor
				.intercept(null, { handle: () => of(null) })
				.pipe(take(1))
				.subscribe((jsonApiData) => {
					expect(jsonApiData).toEqual({
						data: null,
					});

					done();
				});
		});

		it('should return an object with data null, since data was already undefined', (done) => {
			interceptor
				.intercept(null, { handle: () => of(undefined) })
				.pipe(take(1))
				.subscribe((jsonApiData) => {
					expect(jsonApiData).toEqual({
						data: null,
					});

					done();
				});
		});

		it('should return an object with data as an array, since data was already an array', (done) => {
			interceptor
				.intercept(null, { handle: () => of([{ id: '1' }]) })
				.pipe(take(1))
				.subscribe((jsonApiData) => {
					expect(jsonApiData).toEqual({
						data: [{ id: '1' }],
					});

					done();
				});
		});

		it('should return an object with data as an object, since data was already an object', (done) => {
			interceptor
				.intercept(null, { handle: () => of({ id: '1' }) })
				.pipe(take(1))
				.subscribe((jsonApiData) => {
					expect(jsonApiData).toEqual({
						data: { id: '1' },
					});

					done();
				});
		});
	});
});
