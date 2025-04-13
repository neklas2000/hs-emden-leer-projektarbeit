import { HttpException, HttpStatus } from '@nestjs/common';

import { HSEmdenLeerBaseException } from './hs-emden-leer-base.exception';

export class DeleteProjectNotAllowedException extends HSEmdenLeerBaseException {
	constructor(cause: HttpException = null) {
		super(HttpStatus.METHOD_NOT_ALLOWED, 1, {
			message: 'Project cannot be deleted',
			description:
				'The selected project cannot be deleted because the user is not the owner of that project',
			cause,
		});
	}
}
