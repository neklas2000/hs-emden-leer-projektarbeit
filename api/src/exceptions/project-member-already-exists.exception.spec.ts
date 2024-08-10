import { ProjectMemberAlreadyExistsException } from '@Exceptions/project-member-already-exists.exception';

describe('Exception: ProjectMemberAlreadyExistsException', () => {
	it('should throw a ProjectMemberAlreadyExistsException with the correct content', () => {
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
});
