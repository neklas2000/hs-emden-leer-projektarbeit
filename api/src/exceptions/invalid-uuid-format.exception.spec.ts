import { InvalidUUIDFormatException } from '@Exceptions/invalid-uuid-format.exception';

describe('Exception: InvalidUUIDFormatException', () => {
	it('should throw a InvalidUUIDFormatException with the correct content', () => {
		expect(() => {
			throw new InvalidUUIDFormatException('Cause');
		}).toThrow({
			message: 'The value of the parameter is malformed',
			description:
				'The parameter for the requested resource expected an uuid but it was malformed.',
			cause: 'Cause',
			status: 406,
			code: 'HSEL-406-001',
		} as any);
	});
});
