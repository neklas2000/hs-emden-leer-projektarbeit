import { getMetadataArgsStorage } from 'typeorm';

import { CommonEntityFields } from '@Entities/common-entity-fields';

export class EntityMetaStorage {
	static getColumnsByEntity(entity: TFunction | string): string[] {
		return getMetadataArgsStorage()
			.filterColumns([CommonEntityFields, entity])
			.map((column) => column.propertyName);
	}

	static getRelationByEntityAndField(entity: TFunction | string, field: string): TFunction | null {
		return <TFunction | null>(getMetadataArgsStorage()
			.filterRelations([CommonEntityFields, entity])
			.find((relation) => relation.propertyName === field)?.target || null);
	}

	static isRelationPresent(entity: TFunction | string, relation: string): boolean {
		return !!getMetadataArgsStorage()
			.filterRelations([CommonEntityFields, entity])
			.find((relationship) => relationship.propertyName === relation);
	}
}
