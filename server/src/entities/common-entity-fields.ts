import { BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { PrimaryGeneratedUUID } from '@Common/decorators/primary-generated-uuid.decorator';
import { text } from '@Common/utils';
import { JsonSchema } from '@JsonSchema/lib';

/**
 * This base abstract entity provides the following columns:
 * - `id: UUID` (Generated Primary Key)
 * - `createdAt: Date` holds the date at which the record was created
 * - `updatedAt: Date` holds the last date at which the record was updated
 */
@JsonSchema.Resource({ name: 'common-entity-fields' })
export abstract class CommonEntityFields {
	@JsonSchema.Property({
		type: 'string',
		format: 'uuid',
		pattern:
			'/^([A-Fa-f0-9]){8}-([A-Fa-f0-9]){4}-([A-Fa-f0-9]){4}-([A-Fa-f0-9]){4}-([A-Fa-f0-9]){12}$/',
		title: 'The universally unique identifier of a record.',
		description: text`
			This field is a generated universally unique identifier used to uniquely identify each record.
		`,
	})
	@PrimaryGeneratedUUID()
	id: string;

	@JsonSchema.Property({
		type: 'date',
		format: 'YYYY-MM-DD[T]HH:mm:ss.sss',
		title: 'The created timestamp.',
		description: text`
			This field is auto generated and describes when the record was created.
		`,
		required: false,
	})
	@CreateDateColumn({ type: 'datetime', name: 'created_at' })
	createdAt: Date;

	@JsonSchema.Property({
		type: 'date',
		format: 'YYYY-MM-DD[T]HH:mm:ss.sss',
		title: 'The updated timestamp.',
		description: text`
			This field is auto generated and describes when the record was updated for the last time.
		`,
		required: false,
	})
	@UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
	updatedAt: Date;

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}

		if (this.createdAt) {
			this.createdAt = undefined;
		}

		if (this.updatedAt) {
			this.updatedAt = undefined;
		}
	}

	@BeforeUpdate()
	async beforeUpdate(): Promise<void> {
		if (this.updatedAt) {
			this.updatedAt = undefined;
		}

		if (this.createdAt) {
			this.createdAt = undefined;
		}
	}
}
