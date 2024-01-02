import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';
import { BaseEntityWithExtras } from 'src/entities/base-entity-with-extras';
import { FindOptionsSelect, getMetadataArgsStorage } from 'typeorm';

export const SparseFieldsets = createParamDecorator(
  <T extends BaseEntityWithExtras>(
    entity: typeof BaseEntityWithExtras,
    ctx: ExecutionContext,
  ) => {
    const entityMetadata =
      getMetadataArgsStorage().tables.filter(
        (table) => table.target === entity,
      )[0] || null;

    const request = ctx.switchToHttp().getRequest<Request>();
    const sparseFieldsets: FindOptionsSelect<T> = {};

    if (!entityMetadata) return sparseFieldsets;

    const assignPartialSparseFieldsets = (
      fieldsets: object,
      tables: string[],
      fields: string[],
      subEntity: typeof BaseEntityWithExtras,
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

    const assignSparseFieldsets = (
      fieldsets: object,
      table: string,
      fields: string[],
    ) => {
      if (table === entityMetadata.name) {
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
  },
);
