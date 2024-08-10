import { BaseException } from '@Exceptions/base.exception';

describe('Exception: BaseException', () => {
	it('should throw a BaseException with the correct content and extend the HttpException', () => {
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
});
