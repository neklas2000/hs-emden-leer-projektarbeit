import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { type Request } from 'express';
import { FindOptionsSelect } from 'typeorm';

import { getControllerMetadataStorage } from '@Common/controller-metadata-storage';
import { EntityMetaStorage } from '../entity-meta-storage';

type PartialFieldsets = {
	[key: string]: any;
};

type JsonApiSparseFieldsets = {
	[table: string]: string[] | string;
};

export const sparseFieldsetsFactory = (_data: undefined, ctx: ExecutionContext) => {
	const entity = getControllerMetadataStorage().getTypeOfEntityByController(ctx.getClass());
	const request = ctx.switchToHttp().getRequest<Request>();
	const sparseFieldsets: FindOptionsSelect<typeof entity> = {};

	const assignPartialSparseFieldsets = (
		fieldsets: PartialFieldsets,
		tables: string[],
		fields: string[],
		subEntity: TFunction,
	) => {
		const table = tables.splice(0, 1)[0];
		fieldsets[table] = {
			...(fieldsets[table] ?? {}),
		};

		const relation = EntityMetaStorage.getRelationByEntityAndField(subEntity, table);

		if (!relation) return;

		if (tables.length === 0) {
			const columns = EntityMetaStorage.getColumnsByEntity(subEntity);

			for (const field of fields) {
				if (!columns.includes(field)) continue;

				fieldsets[table][field] = true;
			}

			return;
		}

		assignPartialSparseFieldsets(fieldsets[table], tables, fields, subEntity);
	};

	const assignSparseFieldsets = (fieldsets: PartialFieldsets, table: string, fields: string[]) => {
		if (table === entity.name.toLowerCase()) {
			const columns = EntityMetaStorage.getColumnsByEntity(entity);

			for (const field of fields) {
				if (!columns.includes(field)) continue;

				fieldsets[field] = true;
			}

			return;
		}

		assignPartialSparseFieldsets(fieldsets, table.split('.'), fields, entity);
	};

	if (Object.hasOwn(request.query, 'fields')) {
		for (const table in <JsonApiSparseFieldsets>request.query.fields) {
			const fields: string[] = [];

			if (Array.isArray(request.query.fields[table])) {
				for (const entry of <string[]>request.query.fields[table]) {
					fields.push(...entry.split(','));
				}
			} else {
				fields.push(...(<string>request.query.fields[table]).split(','));
			}

			assignSparseFieldsets(sparseFieldsets, table, fields);
		}
	}

	return sparseFieldsets;
};

export const SparseFieldsets = createParamDecorator(sparseFieldsetsFactory);
