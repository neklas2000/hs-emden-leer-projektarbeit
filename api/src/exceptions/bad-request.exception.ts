import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

export class BadRequestException extends BaseException {
	constructor(cause: any) {
		super(HttpStatus.BAD_REQUEST, 1, {
			message: 'Bad Request',
			description: 'An error occured while performing the sql query.',
			cause,
		});
	}
}
