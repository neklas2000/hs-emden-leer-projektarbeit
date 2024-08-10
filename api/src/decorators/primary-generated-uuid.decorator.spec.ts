import { Entity, getMetadataArgsStorage } from 'typeorm';

import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';

describe('Decorator: PrimaryGeneratedUUID', () => {
	it('should have an property of a primary generated uuid', () => {
		@Entity()
		class TestEntity {
			@PrimaryGeneratedUUID()
			id: string;
		}

		const columns = getMetadataArgsStorage().columns.filter(
			(columnMetadata) => columnMetadata.target === TestEntity,
		);
		expect(columns).toHaveLength(1);
		expect(columns[0].propertyName).toEqual('id');
		expect(columns[0].options).toHaveProperty('type', 'uuid');
		expect(columns[0].options).toHaveProperty('primary', true);
		expect(columns[0].options).toHaveProperty('default');
		expect(columns[0].options.default).toBeInstanceOf(Function);
		expect(columns[0].options.default()).toEqual('UUID()');
	});
});
