import { HttpException, HttpStatus } from '@nestjs/common';

import { text } from '@Common/utils/text-node';
import { HSEmdenLeerBaseException } from './hs-emden-leer-base.exception';

export class ProjectMemberAlreadyExistsException extends HSEmdenLeerBaseException {
	constructor(cause: HttpException = null) {
		super(HttpStatus.BAD_REQUEST, 6, {
			message: 'The project member already exists',
			description: text`
				This exception was thrown because the user tried to invite a new project member,
				who is already a member of the project.
			`,
			cause,
		});
	}
}
