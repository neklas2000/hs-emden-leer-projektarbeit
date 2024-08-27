import { AccessTokenGuard } from '@Guards/access-token.guard';

describe('Guard: AccessTokenGuard', () => {
	it('should create', () => {
		const guard = new AccessTokenGuard();

		expect(guard).toBeTruthy();
	});
});
