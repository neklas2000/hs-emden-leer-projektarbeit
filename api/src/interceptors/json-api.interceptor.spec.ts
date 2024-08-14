import { JsonApiInterceptor } from '@Interceptors/json-api.interceptor';

describe('Interceptor: JsonApiInterceptor', () => {
	it('should be created', () => {
		const interceptor = new JsonApiInterceptor();

		expect(interceptor).toBeTruthy();
	});
});
