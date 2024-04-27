import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

export class NoAffectedRowException extends BaseException {
	constructor(cause: any) {
		super(HttpStatus.BAD_REQUEST, 3, {
			message: 'The request resulted in no affected rows.',
			description:
				'This exception can either be caused since actually no row was affected or the database ' +
				'type does not provide the information if rows were affected by the query.',
			cause,
		});
	}
}
