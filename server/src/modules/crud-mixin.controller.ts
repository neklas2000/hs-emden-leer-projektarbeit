import { Body, Delete, Get, Param, Patch, Post, Type } from '@nestjs/common';

import { UUID } from 'crypto';
import { Observable } from 'rxjs';
import { DeepPartial } from 'typeorm';

import { ValidUUID } from '@Common/pipes/valid-uuid.pipe';
import { promiseToObervable } from '@Common/utils';
import { Filters, Includes, JsonApi, SparseFieldsets } from '@JsonApi/lib';
import { CRUDService, UpdateManyPayload, UpdateManyResult } from './crud.service';

abstract class BaseController<T> {
	constructor(readonly service: CRUDService<T>) {}

	abstract create(partialData: DeepPartial<T> | DeepPartial<T>[]): Observable<T[]> | Observable<T>;
	abstract findAll(
		sparseFieldsets: SparseFieldsets<T>,
		includes: Includes<T>,
		filters: Filters<T>,
	): Observable<T[]>;
	abstract findOneBy(
		sparseFieldsets: SparseFieldsets<T>,
		includes: Includes<T>,
		filters: Filters<T>,
	): Observable<T>;
	abstract findOneById(
		id: UUID,
		sparseFieldsets: SparseFieldsets<T>,
		includes: Includes<T>,
	): Observable<T>;
	abstract update(
		updateData: UpdateManyPayload<T>,
		sparseFieldsets: SparseFieldsets<T>,
		includes: Includes<T>,
	): Observable<UpdateManyResult<boolean> | UpdateManyResult<T>>;
	abstract updateOne(
		id: UUID,
		updatePartialData: DeepPartial<T>,
		sparseFieldsets: SparseFieldsets<T>,
		includes: Includes<T>,
	): Observable<boolean | T>;
	abstract updateOneByFilter(
		updateData: DeepPartial<T>,
		sparseFieldsets: SparseFieldsets<T>,
		includes: Includes<T>,
		filters: Filters<T>,
	): Observable<boolean | T>;
	abstract delete(filters: Filters<T>): Observable<boolean>;
	abstract deleteOneById(id: UUID): Observable<boolean>;
}

abstract class MixinControllerBase<T> {
	constructor(readonly service: CRUDService<T>) {}
}

abstract class CreateMixinController<T> extends MixinControllerBase<T> {
	abstract create(partialData: DeepPartial<T> | DeepPartial<T>[]): Observable<T[]> | Observable<T>;
}

function CreateMixin<T>(baseClass: Type<MixinControllerBase<T>>): CreateMixinController<T> {
	abstract class Mixin extends baseClass {
		@Post()
		create(@Body() partialData: DeepPartial<T> | DeepPartial<T>[]) {
			if (Array.isArray(partialData)) {
				return promiseToObervable(this.service.createMany(partialData));
			}

			return promiseToObervable(this.service.createOne(partialData));
		}
	}

	return <any>Mixin;
}

abstract class FindAllMixinController<T> extends MixinControllerBase<T> {
	abstract findAll(
		sparseFieldsets: SparseFieldsets<T>,
		includes: Includes<T>,
		filters: Filters<T>,
	): Observable<T[]>;
}

function FindAllMixin<T>(baseClass: Type<MixinControllerBase<T>>): FindAllMixinController<T> {
	abstract class Mixin extends baseClass {
		@Get()
		findAll(
			@JsonApi.SparseFieldsets() sparseFieldsets: SparseFieldsets<T>,
			@JsonApi.Includes() includes: Includes<T>,
			@JsonApi.Filters() filters: Filters<T>,
		) {
			if (Object.isEmpty(filters)) {
				return promiseToObervable(this.service.readMany(sparseFieldsets, includes));
			}

			return promiseToObervable(this.service.readManyBy(sparseFieldsets, includes, filters));
		}
	}

	return <any>Mixin;
}

abstract class FindOneByMixinController<T> extends MixinControllerBase<T> {
	abstract findOneBy(
		sparseFieldsets: SparseFieldsets<T>,
		includes: Includes<T>,
		filters: Filters<T>,
	): Observable<T>;
}

function FindOneByMixin<T>(baseClass: Type<MixinControllerBase<T>>): FindOneByMixinController<T> {
	abstract class Mixin extends baseClass {
		@Get('find-one-by')
		findOneBy(
			@JsonApi.SparseFieldsets() sparseFieldsets: SparseFieldsets<T>,
			@JsonApi.Includes() includes: Includes<T>,
			@JsonApi.Filters() filters: Filters<T>,
		) {
			return promiseToObervable(this.service.readOneBy(filters, sparseFieldsets, includes));
		}
	}

	return <any>Mixin;
}

abstract class FindOneByIdMixinController<T> extends MixinControllerBase<T> {
	abstract findOneById(
		id: UUID,
		sparseFieldsets: SparseFieldsets<T>,
		includes: Includes<T>,
	): Observable<T>;
}

function FindOneByIdMixin<T>(
	baseClass: Type<MixinControllerBase<T>>,
): FindOneByIdMixinController<T> {
	abstract class Mixin extends baseClass {
		@Get(':id')
		findOneById(
			@Param('id', ValidUUID) id: UUID,
			@JsonApi.SparseFieldsets() sparseFieldsets: SparseFieldsets<T>,
			@JsonApi.Includes() includes: Includes<T>,
		) {
			return promiseToObervable(this.service.readOne(id, sparseFieldsets, includes));
		}
	}

	return <any>Mixin;
}

abstract class UpdateMixinController<T> extends MixinControllerBase<T> {
	abstract update(
		updateData: UpdateManyPayload<T>,
		sparseFieldsets: SparseFieldsets<T>,
		includes: Includes<T>,
	): Observable<UpdateManyResult<boolean> | UpdateManyResult<T>>;
}

function UpdateMixin<T>(baseClass: Type<MixinControllerBase<T>>): UpdateMixinController<T> {
	abstract class Mixin extends baseClass {
		@Patch()
		update(
			@Body() updateData: UpdateManyPayload<T>,
			@JsonApi.SparseFieldsets() sparseFieldsets: SparseFieldsets<T>,
			@JsonApi.Includes() includes: Includes<T>,
		) {
			return promiseToObervable(this.service.updateMany(updateData, sparseFieldsets, includes));
		}
	}

	return <any>Mixin;
}

abstract class UpdateOneMixinController<T> extends MixinControllerBase<T> {
	abstract updateOne(
		id: UUID,
		updatePartialData: DeepPartial<T>,
		sparseFieldsets: SparseFieldsets<T>,
		includes: Includes<T>,
	): Observable<boolean | T>;
}

function UpdateOneMixin<T>(baseClass: Type<MixinControllerBase<T>>): UpdateOneMixinController<T> {
	abstract class Mixin extends baseClass {
		@Patch(':id')
		updateOne(
			@Param('id', ValidUUID) id: UUID,
			@Body() updatePartialData: DeepPartial<T>,
			@JsonApi.SparseFieldsets() sparseFieldsets: SparseFieldsets<T>,
			@JsonApi.Includes() includes: Includes<T>,
		) {
			return promiseToObervable(
				this.service.updateOne(id, updatePartialData, sparseFieldsets, includes),
			);
		}
	}

	return <any>Mixin;
}

abstract class UpdateOneByFilterMixinController<T> extends MixinControllerBase<T> {
	abstract updateOneByFilter(
		updateData: DeepPartial<T>,
		sparseFieldsets: SparseFieldsets<T>,
		includes: Includes<T>,
		filters: Filters<T>,
	): Observable<boolean | T>;
}

function UpdateOneByFilterMixin<T>(
	baseClass: Type<MixinControllerBase<T>>,
): UpdateOneByFilterMixinController<T> {
	abstract class Mixin extends baseClass {
		@Patch('/filter/by')
		updateOneByFilter(
			@Body() updateData: DeepPartial<T>,
			@JsonApi.SparseFieldsets() sparseFieldsets: SparseFieldsets<T>,
			@JsonApi.Includes() includes: Includes<T>,
			@JsonApi.Filters() filters: Filters<T>,
		): Observable<boolean | T> {
			return promiseToObervable(
				this.service.updateOneByFilter(filters, updateData, sparseFieldsets, includes),
			);
		}
	}

	return <any>Mixin;
}

abstract class DeleteMixinController<T> extends MixinControllerBase<T> {
	abstract delete(filters: Filters<T>): Observable<boolean>;
}

function DeleteMixin<T>(baseClass: Type<MixinControllerBase<T>>): DeleteMixinController<T> {
	abstract class Mixin extends baseClass {
		@Delete()
		delete(@JsonApi.Filters() filters: Filters<T>) {
			return promiseToObervable(this.service.deleteBy(filters));
		}
	}

	return <any>Mixin;
}

abstract class DeleteOneByIdMixinController<T> extends MixinControllerBase<T> {
	abstract deleteOneById(id: UUID): Observable<boolean>;
}

function DeleteOneByIdMixin<T>(
	baseClass: Type<MixinControllerBase<T>>,
): DeleteOneByIdMixinController<T> {
	abstract class Mixin extends baseClass {
		@Delete(':id')
		deleteOneById(@Param('id', ValidUUID) id: UUID) {
			return promiseToObervable(this.service.deleteOne(id));
		}
	}

	return <any>Mixin;
}

export const EXCLUDE_ALL_ENDPOINTS: (keyof Omit<BaseController<any>, 'service'>)[] = [
	'create',
	'delete',
	'deleteOneById',
	'findAll',
	'findOneBy',
	'findOneById',
	'update',
	'updateOne',
	'updateOneByFilter',
];

export function CRUDControllerMixin<T, K extends keyof Omit<BaseController<T>, 'service'> = never>(
	_type: Type<T>,
	...excludedEndpoints: K[]
): Type<Omit<BaseController<T>, K>> {
	let mixin: any = MixinControllerBase<T>;

	if (!excludedEndpoints.includes(<any>'create')) {
		mixin = CreateMixin(mixin);
	}

	if (!excludedEndpoints.includes(<any>'findAll')) {
		mixin = FindAllMixin(mixin);
	}

	if (!excludedEndpoints.includes(<any>'findOneBy')) {
		mixin = FindOneByMixin(mixin);
	}

	if (!excludedEndpoints.includes(<any>'findOneById')) {
		mixin = FindOneByIdMixin(mixin);
	}

	if (!excludedEndpoints.includes(<any>'update')) {
		mixin = UpdateMixin(mixin);
	}

	if (!excludedEndpoints.includes(<any>'updateOneByFilter')) {
		mixin = UpdateOneByFilterMixin(mixin);
	}

	if (!excludedEndpoints.includes(<any>'updateOne')) {
		mixin = UpdateOneMixin(mixin);
	}

	if (!excludedEndpoints.includes(<any>'delete')) {
		mixin = DeleteMixin(mixin);
	}

	if (!excludedEndpoints.includes(<any>'deleteOneById')) {
		mixin = DeleteOneByIdMixin(mixin);
	}

	return mixin;
}
