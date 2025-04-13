import { HttpException, HttpStatus } from '@nestjs/common';

import { text } from '@Common/utils/text-node';
import { HSEmdenLeerBaseException } from './hs-emden-leer-base.exception';

export class FileNotFoundException extends HSEmdenLeerBaseException {
	constructor(fileName: string, cause: HttpException = null) {
		super(HttpStatus.NOT_FOUND, 2, {
			message: 'File not found',
			description: text`The file "${fileName}" could not be found. Possibly the name is malformed.`,
			cause,
		});
	}
}
