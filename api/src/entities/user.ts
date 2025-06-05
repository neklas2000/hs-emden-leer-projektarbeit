import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { RelationTypes } from '@Common/base-entity-with-extras';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { Project } from '@Entities/project';
import { TokenWhitelist } from '@Entities/token-whitelist';
import { Nullable } from '@Types/nullable';

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

	@PrimaryGeneratedUUID()
	id: string;

	@Column({ name: 'academic_title', nullable: true, type: 'varchar' })
	academicTitle: Nullable<string>;

	@Column({ name: 'matriculation_number', nullable: true, type: 'int' })
	matriculationNumber: Nullable<number>;

	@Column({ name: 'first_name', nullable: true, type: 'varchar' })
	firstName: Nullable<string>;

	@Column({ name: 'last_name', nullable: true, type: 'varchar' })
	lastName: Nullable<string>;

	@Column({ type: 'varchar' })
	email: string;

	@Column({ type: 'varchar' })
	password: string;

	@Column({ name: 'phone_number', nullable: true, type: 'varchar' })
	phoneNumber: Nullable<string>;

	@OneToMany(() => Project, (project) => project.owner)
	projects: Project[];

	@OneToOne(() => TokenWhitelist, (tokenWhitelist) => tokenWhitelist.user)
	tokenPair: TokenWhitelist;

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}
	}
}
