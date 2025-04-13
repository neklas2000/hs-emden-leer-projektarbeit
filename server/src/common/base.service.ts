import { type DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { BadRequestException } from '@Exceptions/bad-request.exception';
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';

export class BaseService<T> {
	constructor(protected repository: Repository<T>) {}

	protected async insert(partial: DeepPartial<T>): Promise<T> {
		const targetEntity = <QueryDeepPartialEntity<T>>this.repository.create(partial);
		const insertResult = await this.repository.insert(targetEntity);
		targetEntity['id'] = insertResult.identifiers[0].id;

		return <T>targetEntity;
	}

	protected async delete(deleteCondition: FindOptionsWhere<T>): Promise<boolean> {
		try {
			const deleteResult = await this.repository.delete(deleteCondition);

			if (!deleteResult?.affected) {
				throw new NoAffectedRowException();
			}

			return deleteResult.affected > 0;
		} catch (exception) {
			if (exception instanceof NoAffectedRowException) throw exception;

			throw new BadRequestException(exception);
		}
	}
}
