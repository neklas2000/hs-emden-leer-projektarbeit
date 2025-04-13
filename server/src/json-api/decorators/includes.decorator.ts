import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { type Request } from 'express';
import { FindOptionsRelations } from 'typeorm';

import { getControllerMetadataStorage } from '@Common/controller-metadata-storage';
import { EntityMetaStorage } from '../entity-meta-storage';

type PartialIncludes = {
	[key: string]: any;
};

export const includesFactory = (_data: undefined, ctx: ExecutionContext) => {
	const entity = getControllerMetadataStorage().getTypeOfEntityByController(ctx.getClass());
	const request = ctx.switchToHttp().getRequest<Request>();
	const relations: FindOptionsRelations<typeof entity> = {};

	const assignPartialIncludes = (
		relations: PartialIncludes,
		includes: string[],
		entity: TFunction,
	) => {
		const include = includes.splice(0, 1)[0];

		if (!EntityMetaStorage.isRelationPresent(entity, include)) return;
		if (includes.length === 0) {
			relations[include] = true;

			return;
		}

		relations[include] = {
			...(relations[include] || {}),
		};
		assignPartialIncludes(
			relations[include],
			includes,
			EntityMetaStorage.getRelationByEntityAndField(entity, include),
		);
	};

	if (Object.hasOwn(request.query, 'include')) {
		const includes: string[] = [];

		if (Array.isArray(request.query.include)) {
			for (const entry of <string[]>request.query.include) {
				includes.push(...entry.split(','));
			}
		} else {
			includes.push(...(<string>request.query.include).split(','));
		}

		for (const include of includes) {
			assignPartialIncludes(relations, include.split('.'), entity);
		}
	}

	return relations;
};

export const Includes = createParamDecorator(includesFactory);
