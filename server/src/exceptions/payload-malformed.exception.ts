import { HttpException, HttpStatus } from '@nestjs/common';

import { text } from '@Common/utils/text-node';
import { HSEmdenLeerBaseException } from './hs-emden-leer-base.exception';

export class PayloadMalformedException extends HSEmdenLeerBaseException {
	constructor(cause: HttpException = null) {
		super(HttpStatus.BAD_REQUEST, 7, {
			message: 'Malformed payload',
			description: text`
				The payload of the post/put request is malformed.
				It was expected to receive an object with the singular key "data".
			`,
			cause,
		});
	}
}
