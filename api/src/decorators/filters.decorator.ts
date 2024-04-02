import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';
import { FindOptionsWhere } from 'typeorm';

import { BaseEntityWithExtras } from '../common';

export const Filters = createParamDecorator(
  <T extends BaseEntityWithExtras>(
    entity: typeof BaseEntityWithExtras,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const where: FindOptionsWhere<T> = {};

    const assignPartialEqualFilters = (
      filters: object,
      fields: string[],
      value: string,
      entity: typeof BaseEntityWithExtras,
    ) => {
      const field = fields[0];
      fields = fields.slice(1);
      const properties = entity.getProperties();

      if (!properties.includes(field)) return;

      if (fields.length === 0) {
        filters[field] = value;

        return;
      }

      filters[field] = {
        ...(filters[field] || {}),
      };
      assignPartialEqualFilters(
        filters[field],
        fields,
        value,
        entity.getRelationTypes()[field],
      );
    };

    if (Object.hasOwn(request.query, 'filter')) {
      for (const field in request.query.filter as { [field: string]: string }) {
        assignPartialEqualFilters(
          where,
          field.split('.'),
          request.query.filter[field],
          entity,
        );
      }
    }

    return where;
  },
);
