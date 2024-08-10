import { BadRequestException } from '@Exceptions/bad-request.exception';

describe('Exception: BadRequestException', () => {
	it('should throw a BadRequestException with the correct content', () => {
		expect(() => {
			throw new BadRequestException('Cause');
		}).toThrow({
			message: 'Bad Request',
			description: 'An error occured while performing the sql query.',
			cause: 'Cause',
			status: 400,
			code: 'HSEL-400-001',
		} as any);
	});
});
