import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

export class IncorrectCredentialsException extends BaseException {
	constructor(cause: any) {
		super(HttpStatus.BAD_REQUEST, 2, {
			message: 'Incorrect Credentials',
			description: 'The given password or the email address is wrong.',
			cause,
		});
	}
}
