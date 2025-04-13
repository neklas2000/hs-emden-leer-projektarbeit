import { HttpException, HttpStatus } from '@nestjs/common';

import { HSEmdenLeerBaseException } from './hs-emden-leer-base.exception';

export class UserDoesNotExistException extends HSEmdenLeerBaseException {
	constructor(cause: HttpException = null) {
		super(HttpStatus.BAD_REQUEST, 5, {
			message: 'User does not exist',
			description: 'No user could be found by the given search criteria.',
			cause,
		});
	}
}
