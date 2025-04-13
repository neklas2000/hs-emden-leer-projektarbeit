import { HttpException, HttpStatus } from '@nestjs/common';
import { HSEmdenLeerBaseException } from './hs-emden-leer-base.exception';

export class AccessDeniedException extends HSEmdenLeerBaseException {
	constructor(cause: HttpException = null) {
		super(HttpStatus.FORBIDDEN, 1, {
			message: 'Access Denied',
			description: 'Access to the requested endpoint has been denied due to insufficient rights.',
			cause,
		});
	}
}
