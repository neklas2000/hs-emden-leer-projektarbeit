import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';

import { Filters } from './decorators/filters.decorator';
import { Includes } from './decorators/includes.decorator';
import { SparseFieldsets } from './decorators/sparse-fieldsets.decorator';

export class JsonApi {
	static readonly SparseFieldsets = SparseFieldsets;
	static readonly Includes = Includes;
	static readonly Filters = Filters;
}

export type SparseFieldsets<T> = FindOptionsSelect<T>;
export type Includes<T> = FindOptionsRelations<T>;
export type Filters<T> = FindOptionsWhere<T>;
