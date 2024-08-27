import { RefreshTokenGuard } from '@Guards/refresh-token.guard';

describe('Guard: RefreshTokenGuard', () => {
	it('should create', () => {
		const guard = new RefreshTokenGuard();

		expect(guard).toBeTruthy();
	});
});
