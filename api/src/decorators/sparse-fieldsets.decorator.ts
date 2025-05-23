import { ExecutionContext, Type, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';
import { FindOptionsSelect } from 'typeorm';

export const sparseFieldsetsFactory = <T extends Type>(entity: any, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<Request>();
	const sparseFieldsets: FindOptionsSelect<T> = {};

	const assignPartialSparseFieldsets = (
		fieldsets: object,
		tables: string[],
		fields: string[],
		subEntity: any,
	) => {
		const table = tables[0];
		tables = tables.slice(1);
		fieldsets[table] = {
			...(fieldsets[table] || {}),
		};
		const relations = subEntity.getRelationTypes();

		if (!(table in relations)) return;

		subEntity = relations[table];

		if (tables.length === 0) {
			const columns = subEntity.getColumns();

			for (const field of fields) {
				if (!columns.includes(field)) continue;

				fieldsets[table][field] = true;
			}

			return;
		}

		assignPartialSparseFieldsets(fieldsets[table], tables, fields, subEntity);
	};

	const assignSparseFieldsets = (fieldsets: object, table: string, fields: string[]) => {
		if (table === entity.name.toLowerCase()) {
			const columns = entity.getColumns();

			for (const field of fields) {
				if (!columns.includes(field)) continue;

				fieldsets[field] = true;
			}

			return;
		}

		assignPartialSparseFieldsets(fieldsets, table.split('.'), fields, entity);
	};

	if (Object.hasOwn(request.query, 'fields')) {
		for (const table in request.query.fields as {
			[table: string]: string | string[];
		}) {
			const fields: string[] = [];

			if (Array.isArray(request.query.fields[table])) {
				for (const entry of request.query.fields[table] as string[]) {
					fields.push(...entry.split(','));
				}
			} else {
				fields.push(...(request.query.fields[table] as string).split(','));
			}

			assignSparseFieldsets(sparseFieldsets, table, fields);
		}
	}

	return sparseFieldsets;
};

export const SparseFieldsets = createParamDecorator(sparseFieldsetsFactory);
