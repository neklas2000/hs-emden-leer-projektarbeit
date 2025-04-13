import { PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FileTooLargeException } from '@Exceptions/file-too-large.exception';

export class ValidFileSizePipe implements PipeTransform {
	constructor(private readonly config: ConfigService) {}

	transform(file: Express.Multer.File) {
		const maxSize: number = this.config.get('MAX_UPLOAD_FILE_BYTES_SIZE') || 5_000;

		if (file.size > maxSize) {
			throw new FileTooLargeException(maxSize);
		}

		return file;
	}
}
