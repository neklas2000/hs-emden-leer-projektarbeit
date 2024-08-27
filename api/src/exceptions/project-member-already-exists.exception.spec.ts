import { ProjectMemberAlreadyExistsException } from '@Exceptions/project-member-already-exists.exception';

describe('Exception: ProjectMemberAlreadyExistsException', () => {
	it('should throw a ProjectMemberAlreadyExistsException with the correct content (with a cause)', () => {
		expect(() => {
			throw new ProjectMemberAlreadyExistsException('Cause');
		}).toThrow({
			message: 'The project member already exists.',
			description:
				'This exception was thrown because the user tried to add a new project member, .' +
				'who is already a member of the project.',
			cause: 'Cause',
			status: 400,
			code: 'HSEL-400-006',
		} as any);
	});

	it('should throw a ProjectMemberAlreadyExistsException with the correct content (without a cause)', () => {
		expect(() => {
			throw new ProjectMemberAlreadyExistsException();
		}).toThrow({
			message: 'The project member already exists.',
			description:
				'This exception was thrown because the user tried to add a new project member, .' +
				'who is already a member of the project.',
			cause: null,
			status: 400,
			code: 'HSEL-400-006',
		} as any);
	});
});
