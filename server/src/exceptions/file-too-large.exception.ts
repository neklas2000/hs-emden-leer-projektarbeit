import { HttpException, HttpStatus } from '@nestjs/common';

import { text } from '@Common/utils/text-node';
import { HSEmdenLeerBaseException } from './hs-emden-leer-base.exception';

export class FileTooLargeException extends HSEmdenLeerBaseException {
	constructor(maxFileSize: number, cause: HttpException = null) {
		super(HttpStatus.PAYLOAD_TOO_LARGE, 1, {
			message: 'File too large',
			description: text`The uploaded file exceeds the limit of ${maxFileSize} bytes.`,
			cause,
		});
	}
}
