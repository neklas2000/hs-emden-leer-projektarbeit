import { RefreshTokenGuard } from './refresh-token.guard';

describe('Guard: RefreshTokenGuard', () => {
  it('should be created', () => {
    const guard = new RefreshTokenGuard();

    expect(guard).toBeTruthy();
  });
});
