import { HttpException, HttpStatus } from '@nestjs/common';

import { text } from '@Common/utils/text-node';
import { HSEmdenLeerBaseException } from './hs-emden-leer-base.exception';

export class NoAffectedRowException extends HSEmdenLeerBaseException {
	constructor(cause: HttpException = null) {
		super(HttpStatus.BAD_REQUEST, 3, {
			message: 'The request resulted in no affected rows',
			description: text`
				This exception can either be caused since actually no row was affected or the type of the database
				does not provide the information if rows were affected by the query.
			`,
			cause,
		});
	}
}
