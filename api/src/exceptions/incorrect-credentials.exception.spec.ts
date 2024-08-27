import { IncorrectCredentialsException } from '@Exceptions/incorrect-credentials.exception';

describe('Exception: IncorrectCredentialsException', () => {
	it('should throw a IncorrectCredentialsException with the correct content (with a cause)', () => {
		expect(() => {
			throw new IncorrectCredentialsException('Cause');
		}).toThrow({
			message: 'Incorrect Credentials',
			description: 'The given password or the email address is wrong.',
			cause: 'Cause',
			status: 400,
			code: 'HSEL-400-002',
		} as any);
	});

	it('should throw a IncorrectCredentialsException with the correct content (without a cause)', () => {
		expect(() => {
			throw new IncorrectCredentialsException();
		}).toThrow({
			message: 'Incorrect Credentials',
			description: 'The given password or the email address is wrong.',
			cause: null,
			status: 400,
			code: 'HSEL-400-002',
		} as any);
	});
});
