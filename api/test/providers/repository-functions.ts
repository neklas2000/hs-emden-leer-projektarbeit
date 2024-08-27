import {
	DeepPartial,
	FindManyOptions,
	FindOneOptions,
	FindOptionsWhere,
	RemoveOptions,
	SaveOptions,
} from 'typeorm';

export const createRepositoryFunctions = <T>() => ({
	find: (options?: FindManyOptions<T>) => Promise.resolve([options]),
	findOne: (options: FindOneOptions<T>) => Promise.resolve(options),
	findOneBy: (where: FindOptionsWhere<T>) => Promise.resolve(where),
	remove: (entity: T, options?: RemoveOptions) => [entity, options],
	create: (entityLike: DeepPartial<T>) => entityLike,
	save: (entity: T, options?: SaveOptions) => Promise.resolve([entity, options]),
	delete: (criteria: string | number | FindOptionsWhere<T>) => {
		return Promise.resolve({
			affected: 1,
			raw: '',
			criteria,
		});
	},
	update: (criteria: string | number | FindOptionsWhere<T>, partialEntity: DeepPartial<T>) => {
		return Promise.resolve({
			affected: 1,
			raw: '',
			criteria,
			partialEntity,
		});
	},
	insert: (entityLike: DeepPartial<T>) => Promise.resolve(entityLike),
	createQueryBuilder: (tableAlias: string) => tableAlias,
});
