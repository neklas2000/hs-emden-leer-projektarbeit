import { getSchemaMetadataStorage } from '../schema-metadata-storage';

type ResourceOptions = {
	name?: string;
	title?: string;
	description?: string;
};

export function Resource({ name, title, description }: ResourceOptions): ClassDecorator {
	const storage = getSchemaMetadataStorage();

	return (targetConstructor) => {
		const resource = storage.addResource(
			name || targetConstructor.name.toLowerCase(),
			targetConstructor,
		);

		resource.setTitle(title || null);
		resource.setDescription(description || null);
	};
}
