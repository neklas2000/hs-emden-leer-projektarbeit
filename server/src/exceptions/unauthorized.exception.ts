import { HttpException, HttpStatus } from '@nestjs/common';

import { HSEmdenLeerBaseException } from './hs-emden-leer-base.exception';

export class UnauthorizedException extends HSEmdenLeerBaseException {
	constructor(cause: HttpException = null) {
		super(HttpStatus.UNAUTHORIZED, 1, {
			message: 'Unauthorized',
			description: 'This request requires authorization provided by an access token',
			cause,
		});
	}
}
