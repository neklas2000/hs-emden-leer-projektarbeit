export type GetEntityTypeFn = () => TFunction;

class ControllerMetadata {
	private entityType: GetEntityTypeFn;

	getEntityType(): TFunction {
		return this.entityType();
	}

	setEntityTypeFn(entityTypeFn: GetEntityTypeFn): void {
		this.entityType = entityTypeFn;
	}
}

type Controllers = {
	[controller: string]: ControllerMetadata;
};

class ControllerMetadataStorage {
	static readonly instance = new ControllerMetadataStorage();
	private readonly controllers: Controllers;

	static getSingleton() {
		return this.instance;
	}

	private constructor() {
		this.controllers = {};
	}

	addControllerMetadata(controllerType: TFunction): ControllerMetadata {
		const metadata = new ControllerMetadata();

		this.controllers[controllerType.name] = metadata;

		return metadata;
	}

	getTypeOfEntityByController(controllerType: TFunction): TFunction {
		if (!Object.hasOwn(this.controllers, controllerType.name)) return null;

		return this.controllers[controllerType.name].getEntityType();
	}
}

export function getControllerMetadataStorage() {
	return ControllerMetadataStorage.getSingleton();
}
