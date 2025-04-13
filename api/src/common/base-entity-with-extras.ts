import { Type } from '@nestjs/common';
import { BaseEntity } from 'typeorm';

export type RelationTypes = {
	[property: string]: Type;
};

export class BaseEntityWithExtras extends BaseEntity {
	public static getRelationTypes(): RelationTypes {
		return {};
	}

	public static getRelations(): string[] {
		return [];
	}

	public static getColumns(): string[] {
		return [];
	}

	public static getProperties(): string[] {
		return this.getRelations().concat(...this.getColumns());
	}
}
