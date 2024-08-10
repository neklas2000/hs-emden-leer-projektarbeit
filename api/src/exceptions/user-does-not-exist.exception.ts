import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@Exceptions/base.exception';
import { Nullable } from '@Types/nullable';

export class UserDoesNotExistException extends BaseException {
	constructor(email: Nullable<string>, cause: any) {
		super(HttpStatus.BAD_REQUEST, 5, {
			message: 'User does not exist',
			description: email
				? `There is no user present who goes by the provided email address (${email}).`
				: 'No user could be found by the given search criteria.',
			cause,
		});
	}
}
