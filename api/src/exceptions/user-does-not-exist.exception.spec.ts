import { UserDoesNotExistException } from '@Exceptions/user-does-not-exist.exception';

describe('Exception: UserDoesNotExistException', () => {
	it('should throw a UserDoesNotExistException with the correct email content', () => {
		expect(() => {
			throw new UserDoesNotExistException('max.mustermann@gmx.de', 'Cause');
		}).toThrow({
			message: 'User does not exist',
			description:
				'There is no user present who goes by the provided email address (max.mustermann@gmx.de).',
			cause: 'Cause',
			status: 400,
			code: 'HSEL-400-005',
		} as any);
	});

	it('should throw a UserDoesNotExistException with the correct generic content', () => {
		expect(() => {
			throw new UserDoesNotExistException(null, 'Cause');
		}).toThrow({
			message: 'User does not exist',
			description: 'No user could be found by the given search criteria.',
			cause: 'Cause',
			status: 400,
			code: 'HSEL-400-005',
		} as any);
	});
});
