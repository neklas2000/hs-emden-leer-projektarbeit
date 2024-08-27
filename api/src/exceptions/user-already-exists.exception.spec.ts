import { UserAlreadyExistsException } from '@Exceptions/user-already-exists.exception';

describe('Exception: UserAlreadyExistsException', () => {
	it('should throw a UserAlreadyExistsException with the correct content (with a cause)', () => {
		expect(() => {
			throw new UserAlreadyExistsException('max.mustermann@gmx.de', 'Cause');
		}).toThrow({
			message: 'User already exists',
			description: 'The provided email address (max.mustermann@gmx.de) is already registered.',
			cause: 'Cause',
			status: 400,
			code: 'HSEL-400-004',
		} as any);
	});

	it('should throw a UserAlreadyExistsException with the correct content (without a cause)', () => {
		expect(() => {
			throw new UserAlreadyExistsException('max.mustermann@gmx.de');
		}).toThrow({
			message: 'User already exists',
			description: 'The provided email address (max.mustermann@gmx.de) is already registered.',
			cause: null,
			status: 400,
			code: 'HSEL-400-004',
		} as any);
	});
});
