import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';
import { FindOptionsRelations } from 'typeorm';

import { BaseEntityWithExtras } from 'src/entities/base-entity-with-extras';

export type JsonApiIncludes = string[];

export const Includes = createParamDecorator(
  <T extends BaseEntityWithExtras>(
    entity: typeof BaseEntityWithExtras,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const relations: FindOptionsRelations<T> = {};

    const assignPartialIncludes = (
      relations: object,
      includes: string[],
      entity: typeof BaseEntityWithExtras,
    ) => {
      const include = includes[0];
      includes = includes.slice(1);
      const existingRelations = entity.getRelations();

      if (!existingRelations.includes(include)) return;

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
        entity.getRelationTypes()[include],
      );
    };

    if (Object.hasOwn(request.query, 'include')) {
      const includes: string[] = [];

      if (Array.isArray(request.query.include)) {
        for (const entry of request.query.include as string[]) {
          includes.push(...entry.split(','));
        }
      } else {
        includes.push(...(request.query.include as string).split(','));
      }

      for (const include of includes) {
        assignPartialIncludes(relations, include.split('.'), entity);
      }
    }

    return relations;
  },
);
