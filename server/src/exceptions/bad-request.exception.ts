import { HttpException, HttpStatus } from '@nestjs/common';

import { HSEmdenLeerBaseException } from './hs-emden-leer-base.exception';

export class BadRequestException extends HSEmdenLeerBaseException {
	constructor(cause: HttpException = null) {
		super(HttpStatus.BAD_REQUEST, 1, {
			message: 'Bad Request',
			description: 'An error occurred while performing the sql query.',
			cause,
		});
	}
}
