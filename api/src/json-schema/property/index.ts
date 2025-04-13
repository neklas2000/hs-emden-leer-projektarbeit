import { getSchemaMetadataStorage, PropertyOptions } from '../schema-metadata-storage';

export function Property({ type, ...remainingOptions }: PropertyOptions): PropertyDecorator {
	const storage = getSchemaMetadataStorage();

	return (target, propertyKey) => {
		storage.getResource(target.constructor.name, (resource) => {
			const property = resource.addProperty(<string>propertyKey);

			property.setType(type);

			const setters = {
				title: (title: string) => property.setTitle(title),
				description: (description: string) => property.setDescription(description),
				format: (format: string) => property.setFormat(format),
				pattern: (pattern: string) => property.setPattern(pattern),
				defaultValue: (defaultValue: any) => property.setDefault(defaultValue),
				maxLength: (maxLength: number) => property.setMaxLength(maxLength),
				minimum: (minimum: number) => property.setMinimum(minimum),
				exclusiveMinimum: (exclusiveMinimum: boolean) =>
					property.setExclusiveMinimum(exclusiveMinimum),
				maximum: (maximum: number) => property.setMaximum(maximum),
				exclusiveMaximum: (exclusiveMaximum: boolean) =>
					property.setExclusiveMaximum(exclusiveMaximum),
				required: (required: boolean) => property.setRequired(required),
				decimals: (decimals: number) => property.setDecimals(decimals),
			};

			for (const option in remainingOptions) {
				const setterFn = setters[option];

				if (setterFn) {
					setterFn(remainingOptions[option]);
				} else {
					console.error(`The option '${option}' doesn't exist as property metadata.`);
				}
			}
		});
	};
}
