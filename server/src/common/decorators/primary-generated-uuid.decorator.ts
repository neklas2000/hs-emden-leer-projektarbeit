import { Column, ColumnOptions } from 'typeorm';

export function PrimaryGeneratedUUID(options: ColumnOptions = {}): PropertyDecorator {
	return function (target: object, propertyKey: string | symbol) {
		Column({
			type: 'uuid',
			default: () => 'UUID()',
			primary: true,
			...options,
		})(target, propertyKey);
	};
}
