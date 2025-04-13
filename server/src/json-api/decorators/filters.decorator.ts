import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { type Request } from 'express';
import { FindOptionsWhere } from 'typeorm';

import { EntityMetaStorage } from '../entity-meta-storage';
import { getControllerMetadataStorage } from '@Common/controller-metadata-storage';

type PartialWhereConditions = {
	[key: string]: any;
};

type JsonApiFilter = {
	[field: string]: any;
};

export const filterFactory = (_data: undefined, ctx: ExecutionContext) => {
	const entity = getControllerMetadataStorage().getTypeOfEntityByController(ctx.getClass());
	const request = ctx.switchToHttp().getRequest<Request>();
	const where: FindOptionsWhere<typeof entity> = {};

	const assignPartialFilters = (
		filters: PartialWhereConditions,
		fields: string[],
		value: any,
		entity: TFunction,
	) => {
		const field = fields.splice(0, 1)[0];
		const properties = EntityMetaStorage.getColumnsByEntity(entity);

		if (!properties.includes(field)) return;

		if (fields.length === 0) {
			filters[field] = value;

			return;
		}

		filters[field] = {
			...(filters[field] || {}),
		};
		assignPartialFilters(
			filters[field],
			fields,
			value,
			EntityMetaStorage.getRelationByEntityAndField(entity, field),
		);
	};

	if (Object.hasOwn(request.query, 'filter')) {
		for (const field in <JsonApiFilter>request.query.filter) {
			assignPartialFilters(where, field.split('.'), request.query.filter[field], entity);
		}
	}

	return where;
};

export const Filters = createParamDecorator(filterFactory);
