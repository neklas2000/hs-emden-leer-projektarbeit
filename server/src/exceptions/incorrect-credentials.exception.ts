import { HttpException, HttpStatus } from '@nestjs/common';

import { HSEmdenLeerBaseException } from './hs-emden-leer-base.exception';

export class IncorrectCredentialsException extends HSEmdenLeerBaseException {
	constructor(cause: HttpException = null) {
		super(HttpStatus.BAD_REQUEST, 2, {
			message: 'Incorrect credentials',
			description: 'The given password or the email address is wrong.',
			cause,
		});
	}
}
