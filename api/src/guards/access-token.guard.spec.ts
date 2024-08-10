import { AccessTokenGuard } from '@Guards/access-token.guard';

describe('Guard: AccessTokenGuard', () => {
	it('should be created', () => {
		const guard = new AccessTokenGuard();

		expect(guard).toBeTruthy();
	});
});
