import { InjectDataSource } from '@nestjs/typeorm';

import { UUID } from 'crypto';
import { DataSource, DeepPartial, In, Repository } from 'typeorm';

import { BadRequestException } from '@Exceptions/bad-request.exception';
import { Filters, Includes, SparseFieldsets } from '@JsonApi/lib';
import { NotFoundException } from '@nestjs/common';

export type UpdateManyPayload<T> = {
	[id: UUID]: DeepPartial<T>;
};

export type UpdateManyResult<T> = {
	[id: UUID]: T;
};

export abstract class CRUDService<T> {
	@InjectDataSource()
	protected dataSource: DataSource;

	constructor(protected readonly repository: Repository<T>) {}

	async createMany(partialData: DeepPartial<T>[]) {
		const queryRunner = this.getQueryRunner();
		queryRunner.startTransaction();

		try {
			const ids: UUID[] = [];

			partialData.forEach(async (partialRecord) => {
				const insertEntity = this.repository.create(partialRecord);
				const insertResult = await this.repository.insert(<any>insertEntity);

				ids.push(insertResult.identifiers[0].id);
			});

			await queryRunner.commitTransaction();

			return this.repository.find(<any>{ id: In(ids) });
		} catch (err) {
			await queryRunner.rollbackTransaction();

			throw new BadRequestException(err);
		} finally {
			await queryRunner.release();
		}
	}

	async createOne(partialData: DeepPartial<T>, select?: SparseFieldsets<T>, joins?: Includes<T>) {
		const insertEntity = this.repository.create(partialData);
		const insertResult = await this.repository.insert(<any>insertEntity);

		return this.readOne(insertResult.identifiers[0].id, select, joins);
	}

	readMany(select: SparseFieldsets<T>, joins: Includes<T>): Promise<T[]> {
		return this.repository.find({
			select,
			relations: joins,
		});
	}

	readManyBy(select: SparseFieldsets<T>, joins: Includes<T>, where: Filters<T>): Promise<T[]> {
		return this.repository.find({
			select,
			relations: joins,
			where,
		});
	}

	readOne(id: UUID, select?: SparseFieldsets<T>, joins?: Includes<T>): Promise<T> {
		return this.repository.findOne({
			select,
			relations: joins,
			where: <Filters<T & { id: UUID }>>{
				id,
			},
		});
	}

	readOneBy(where: Filters<T>, select?: SparseFieldsets<T>, joins?: Includes<T>): Promise<T> {
		return this.repository.findOne({
			select,
			relations: joins,
			where,
		});
	}

	async updateMany(
		updateData: UpdateManyPayload<T>,
		select: SparseFieldsets<T>,
		joins: Includes<T>,
	): Promise<UpdateManyResult<T> | UpdateManyResult<boolean>> {
		const shouldResolveUpdatedRecords = !Object.isEmpty(select) || !Object.isEmpty(joins);

		const queryRunner = this.getQueryRunner();
		queryRunner.startTransaction();

		try {
			const updateQueries = Object.keys(updateData).map(async (recordId: UUID) => {
				const result = await this.repository.update(recordId, <any>updateData[recordId]);

				if (!shouldResolveUpdatedRecords) {
					return {
						[recordId]: result.affected > 0,
					};
				}

				const updatedRecord = await this.readOne(recordId, select, joins);

				return {
					[recordId]: updatedRecord,
				};
			});

			const results = await Promise.all(updateQueries);

			await queryRunner.commitTransaction();

			return <UpdateManyResult<T> | UpdateManyResult<boolean>>results.reduce(
				(accumulator, result) => {
					return {
						...accumulator,
						...result,
					};
				},
				{},
			);
		} catch (err) {
			await queryRunner.rollbackTransaction();

			throw new BadRequestException(err);
		} finally {
			await queryRunner.release();
		}
	}

	async updateOne(
		id: UUID,
		partialData: DeepPartial<T>,
		select?: SparseFieldsets<T>,
		joins?: Includes<T>,
	): Promise<T | boolean> {
		const shouldResolveUpdatedRecords = !Object.isEmpty(select) || !Object.isEmpty(joins);

		const queryRunner = this.getQueryRunner();
		queryRunner.startTransaction();

		try {
			const result = await this.repository.update({ id: <any>id }, <any>partialData);

			if (!shouldResolveUpdatedRecords) {
				await queryRunner.commitTransaction();

				return result.affected > 0;
			}

			const updatedRecord = await this.readOne(id, select, joins);

			await queryRunner.commitTransaction();

			return updatedRecord;
		} catch (err) {
			await queryRunner.rollbackTransaction();

			throw new BadRequestException(err);
		} finally {
			await queryRunner.release();
		}
	}

	async updateOneByFilter(
		filters: Filters<T>,
		partialData: DeepPartial<T>,
		select?: SparseFieldsets<T>,
		joins?: Includes<T>,
	): Promise<boolean | T> {
		if (!filters || Object.isEmpty(filters)) {
			throw new BadRequestException();
		}

		const shouldResolveUpdatedRecord = !Object.isEmpty(select) || !Object.isEmpty(joins);

		const queryRunner = this.getQueryRunner();
		queryRunner.startTransaction();

		try {
			const result = await this.repository.update(filters, <any>partialData);
			console.log(result);

			if (result.affected === 0) {
				throw new NotFoundException();
			}

			if (!shouldResolveUpdatedRecord) {
				await queryRunner.commitTransaction();

				return result.affected > 0;
			}

			const updatedRecord = await this.readOne(result.generatedMaps[0].id, select, joins);

			await queryRunner.commitTransaction();

			return updatedRecord;
		} catch (err) {
			await queryRunner.rollbackTransaction();

			throw new BadRequestException(err);
		} finally {
			await queryRunner.release();
		}
	}

	async deleteBy(where: Filters<T>): Promise<boolean> {
		const deleteResult = await this.repository.delete(where);

		return deleteResult.affected > 0;
	}

	async deleteOne(id: UUID): Promise<boolean> {
		const deleteResult = await this.repository.delete(id);

		return deleteResult.affected > 0;
	}

	protected getQueryRunner() {
		return this.dataSource.createQueryRunner();
	}
}
