import { HttpException, HttpStatus } from '@nestjs/common';

import { HSEmdenLeerBaseException } from './hs-emden-leer-base.exception';

export class InvalidUUIDFormatException extends HSEmdenLeerBaseException {
	constructor(cause: HttpException = null) {
		super(HttpStatus.NOT_ACCEPTABLE, 1, {
			message: 'The value of the parameter is malformed',
			description: 'The parameter for the requested resource expected an uuid but it was malformed',
			cause,
		});
	}
}
