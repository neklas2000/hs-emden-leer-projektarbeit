import { DeleteProjectNotAllowedException } from '@Exceptions/delete-project-not-allowed.exception';

describe('Exception: DeleteProjectNotAllowedException', () => {
	it('should throw a DeleteProjectNotAllowedException with the correct content (with a cause)', () => {
		expect(() => {
			throw new DeleteProjectNotAllowedException('Cause');
		}).toThrow({
			message: 'Project cannot be deleted',
			description:
				'The selected project cannot be deleted because the user is not the owner of that project.',
			cause: 'Cause',
			status: 405,
			code: 'HSEL-405-001',
		} as any);
	});

	it('should throw a DeleteProjectNotAllowedException with the correct content (without a cause)', () => {
		expect(() => {
			throw new DeleteProjectNotAllowedException();
		}).toThrow({
			message: 'Project cannot be deleted',
			description:
				'The selected project cannot be deleted because the user is not the owner of that project.',
			cause: null,
			status: 405,
			code: 'HSEL-405-001',
		} as any);
	});
});
