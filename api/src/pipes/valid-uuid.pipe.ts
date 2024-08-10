import { PipeTransform } from '@nestjs/common';

import { InvalidUUIDFormatException } from '@Exceptions/invalid-uuid-format.exception';

export class ValidUUIDPipe implements PipeTransform {
	transform(value: any): string {
		if (typeof value !== 'string') throw new InvalidUUIDFormatException(null);

		const regex = /^([a-f0-9]){8}-([a-f0-9]){4}-([a-f0-9]){4}-([a-f0-9]){4}-([a-f0-9]){12}$/;

		if (!regex.test(value.toLowerCase())) throw new InvalidUUIDFormatException(null);

		return value;
	}
}
