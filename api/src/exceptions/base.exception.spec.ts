import { BaseException } from '@Exceptions/base.exception';

describe('Exception: BaseException', () => {
	it('should throw a BaseException with the correct content and extend the HttpException (with a cause)', () => {
		expect(() => {
			throw new BaseException(200, 1, {
				message: 'Exceptions message',
				description: 'Exceptions description',
				cause: 'Exceptions cause',
			});
		}).toThrow({
			message: 'Exceptions message',
			description: 'Exceptions description',
			cause: 'Exceptions cause',
			status: 200,
			code: 'HSEL-200-001',
		} as any);
	});

	it('should throw a BaseException with the correct content and extend the HttpException (without a cause)', () => {
		expect(() => {
			throw new BaseException(200, 1, {
				message: 'Exceptions message',
				description: 'Exceptions description',
				cause: null,
			});
		}).toThrow({
			message: 'Exceptions message',
			description: 'Exceptions description',
			cause: null,
			status: 200,
			code: 'HSEL-200-001',
		} as any);
	});
});
