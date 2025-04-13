import { getSchemaMetadataStorage, type RelationshipOptions } from '../schema-metadata-storage';

export function Relationship({
	type,
	...remainingOptions
}: RelationshipOptions): PropertyDecorator {
	const storage = getSchemaMetadataStorage();

	return (target, propertyKey) => {
		storage.getResource(target.constructor.name, (resource) => {
			const relationship = resource.addRelationship(<string>propertyKey);
			relationship.setType(type);

			const setters = {
				title: (title: string) => relationship.setTitle(title),
				description: (description: string) => relationship.setDescription(description),
				hasMany: (hasMany: boolean) => relationship.setMultiple(hasMany),
			};

			for (const option in remainingOptions) {
				const setterFn = setters[option];

				if (setterFn) {
					setterFn(remainingOptions[option]);
				}
			}
		});
	};
}
