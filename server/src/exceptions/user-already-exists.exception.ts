import { HttpException, HttpStatus } from '@nestjs/common';

import { HSEmdenLeerBaseException } from './hs-emden-leer-base.exception';

export class UserAlreadyExistsException extends HSEmdenLeerBaseException {
	constructor(cause: HttpException = null) {
		super(HttpStatus.BAD_REQUEST, 4, {
			message: 'User already exists',
			description: 'An user with the provided email address already exists.',
			cause,
		});
	}
}
