import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

export class ProjectMemberAlreadyExistsException extends BaseException {
	constructor(cause: any = null) {
		super(HttpStatus.BAD_REQUEST, 6, {
			message: 'The project member already exists.',
			description:
				'This exception was thrown because the user tried to add a new project member, .' +
				'who is already a member of the project.',
			cause,
		});
	}
}
