import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@Exceptions/base.exception';

export class DeleteProjectNotAllowedException extends BaseException {
	constructor(cause: any) {
		super(HttpStatus.METHOD_NOT_ALLOWED, 1, {
			message: 'Project cannot be deleted',
			description:
				'The selected project cannot be deleted because the user is not the owner of that project.',
			cause,
		});
	}
}
