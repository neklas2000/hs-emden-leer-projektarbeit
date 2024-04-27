import { NoAffectedRowException } from './no-affected-row.exception';

describe('Exception: NoAffectedRowException', () => {
	it('should throw a NoAffectedRowException with the correct content', () => {
		expect(() => {
			throw new NoAffectedRowException('Cause');
		}).toThrow({
			message: 'The request resulted in no affected rows.',
			description:
				'This exception can either be caused since actually no row was affected or the database ' +
				'type does not provide the information if rows were affected by the query.',
			cause: 'Cause',
			status: 400,
			code: 'HSEL-400-003',
		} as any);
	});
});
