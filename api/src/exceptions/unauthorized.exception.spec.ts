import { UnauthorizedException } from './unauthorized.exception';

describe('Exception: UnauthorizedException', () => {
  it('should throw a UnauthorizedException with the correct content', () => {
    expect(() => {
      throw new UnauthorizedException('Cause');
    }).toThrow({
      message: 'Unauthorized',
      description:
        'This request requires authorization provided by an access token.',
      cause: 'Cause',
      status: 401,
      code: 'HSEL-401-001',
    } as any);
  });
});
