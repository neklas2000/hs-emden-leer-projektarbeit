import { getMetadataArgsStorage } from 'typeorm';

export class EntityMetaStorage {
	static getColumnsByEntity(entity: TFunction | string): string[] {
		return getMetadataArgsStorage()
			.filterColumns(entity)
			.map((column) => column.propertyName);
	}

	static getRelationByEntityAndField(entity: TFunction | string, field: string): TFunction | null {
		return <TFunction | null>(getMetadataArgsStorage()
			.filterRelations(entity)
			.find((relation) => relation.propertyName === field)?.target || null);
	}

	static isRelationPresent(entity: TFunction | string, relation: string): boolean {
		return !!getMetadataArgsStorage()
			.filterRelations(entity)
			.find((relationship) => relationship.propertyName === relation);
	}
}
