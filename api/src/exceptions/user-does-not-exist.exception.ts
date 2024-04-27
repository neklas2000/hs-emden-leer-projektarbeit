import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

export class UserDoesNotExistException extends BaseException {
	constructor(email: string, cause: any) {
		super(HttpStatus.BAD_REQUEST, 5, {
			message: 'User does not exist',
			description: `There is no user present who goes by the provided email address (${email}).`,
			cause,
		});
	}
}
