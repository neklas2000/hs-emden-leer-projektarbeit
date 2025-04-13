import { ControllerOptions, Controller as NestController } from '@nestjs/common';

import {
	getControllerMetadataStorage,
	type GetEntityTypeFn,
} from '@Common/controller-metadata-storage';

export function Controller(getEntityType: GetEntityTypeFn): ClassDecorator;
export function Controller(
	getEntityType: GetEntityTypeFn,
	prefix: string | string[],
): ClassDecorator;
export function Controller(
	getEntityType: GetEntityTypeFn,
	options: ControllerOptions,
): ClassDecorator;

export function Controller(
	getEntityType: GetEntityTypeFn,
	prefixOrOptions?: string | string[] | ControllerOptions,
): ClassDecorator {
	const storage = getControllerMetadataStorage();

	return (target) => {
		const metadata = storage.addControllerMetadata(target);
		metadata.setEntityTypeFn(getEntityType);

		if (!prefixOrOptions) {
			NestController()(target);
		} else {
			NestController(<any>prefixOrOptions)(target);
		}
	};
}
