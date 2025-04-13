import { HttpException, HttpStatus } from '@nestjs/common';
import { HSEmdenLeerBaseException } from './hs-emden-leer-base.exception';

export class InternalServerErrorException extends HSEmdenLeerBaseException {
	constructor(cause: HttpException = null) {
		super(HttpStatus.INTERNAL_SERVER_ERROR, 2, {
			message: 'Internal server error',
			description: 'An exception occurred while handling the request.',
			cause,
		});
	}
}
