import { UserAlreadyExistsException } from './user-already-exists.exception';

describe('Exception: UserAlreadyExistsException', () => {
	it('should throw a UserAlreadyExistsException with the correct content', () => {
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
});
