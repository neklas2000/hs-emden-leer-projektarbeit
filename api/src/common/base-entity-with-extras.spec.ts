import { BaseEntityWithExtras } from './base-entity-with-extras';

describe('Common: BaseEntityWithExtras', () => {
	it('should return all properties of the test entity by calling the function of BaseEntityWithExtras', () => {
		class TestEntity extends BaseEntityWithExtras {
			static override getRelations(): string[] {
				return ['relationA', 'relationB'];
			}

			static override getColumns(): string[] {
				return ['fieldA', 'fieldB', 'fieldC'];
			}
		}

		expect(TestEntity.getProperties()).toEqual([
			'relationA',
			'relationB',
			'fieldA',
			'fieldB',
			'fieldC',
		]);
	});

	it('should return all columns', () => {
		expect(BaseEntityWithExtras.getColumns()).toEqual([]);
	});

	it('should return all relations', () => {
		expect(BaseEntityWithExtras.getRelations()).toEqual([]);
	});

	it('should return all relation types', () => {
		expect(BaseEntityWithExtras.getRelationTypes()).toEqual({});
	});
});
