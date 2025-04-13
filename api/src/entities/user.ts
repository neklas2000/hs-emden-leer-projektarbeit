import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { RelationTypes } from '@Common/base-entity-with-extras';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { Project } from '@Entities/project';
import { TokenWhitelist } from '@Entities/token-whitelist';
import { Nullable } from '@Types/nullable';
import { JsonSchema } from 'json-schema';

@JsonSchema.Resource({ name: 'users' })
@Entity('user')
export class User {
	static getRelationTypes(): RelationTypes {
		return {
			projects: Project,
		};
	}

	static getRelations(): string[] {
		return ['projects'];
	}

	static getColumns(): string[] {
		return [
			'id',
			'academicTitle',
			'matriculationNumber',
			'firstName',
			'lastName',
			'email',
			'password',
			'phoneNumber',
		];
	}

	@JsonSchema.Property({
		type: 'string',
		format: 'uuid',
		pattern:
			'/^([A-Fa-f0-9]){8}-([A-Fa-f0-9]){4}-([A-Fa-f0-9]){4}-([A-Fa-f0-9]){4}-([A-Fa-f0-9]){12}$/',
		title: 'The unique generated id',
	})
	@PrimaryGeneratedUUID()
	id: string;

	@JsonSchema.Property({
		type: 'string',
		required: false,
		title: 'The academic title of a person',
	})
	@Column({ name: 'academic_title', nullable: true, type: 'varchar' })
	academicTitle: Nullable<string>;

	@JsonSchema.Property({
		type: 'number',
		format: 'uint',
		required: false,
		title: 'The matriculation number of a student',
	})
	@Column({ name: 'matriculation_number', nullable: true, type: 'int' })
	matriculationNumber: Nullable<number>;

	@JsonSchema.Property({
		type: 'string',
		required: false,
		title: 'The first name of an user',
	})
	@Column({ name: 'first_name', nullable: true, type: 'varchar' })
	firstName: Nullable<string>;

	@JsonSchema.Property({
		type: 'string',
		required: false,
		title: 'The last name of an user',
	})
	@Column({ name: 'last_name', nullable: true, type: 'varchar' })
	lastName: Nullable<string>;

	@JsonSchema.Property({
		type: 'string',
		title: 'The e-mail address of an user',
	})
	@Column({ type: 'varchar' })
	email: string;

	@JsonSchema.Property({
		type: 'string',
		title: 'The password of an user',
	})
	@Column({ type: 'varchar' })
	password: string;

	@JsonSchema.Property({
		type: 'string',
		required: false,
		title: 'A persons phone number',
	})
	@Column({ name: 'phone_number', nullable: true, type: 'varchar' })
	phoneNumber: Nullable<string>;

	@JsonSchema.Relationship({
		type: 'Project',
		hasMany: true,
		title: 'All projects created by this user',
	})
	@OneToMany(() => Project, (project) => project.owner)
	projects: Project[];

	@JsonSchema.Relationship({
		type: 'TokenWhitelist',
		title: 'The current token pair, used by the user',
	})
	@OneToOne(() => TokenWhitelist, (tokenWhitelist) => tokenWhitelist.user)
	tokenPair: TokenWhitelist;

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}
	}
}
