import { BaseException } from '@Exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidUUIDFormatException extends BaseException {
	constructor(cause: any) {
		super(HttpStatus.NOT_ACCEPTABLE, 1, {
			message: 'The value of the parameter is malformed',
			description:
				'The parameter for the requested resource expected an uuid but it was malformed.',
			cause,
		});
	}
}
