import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { BaseEntityWithExtras, RelationTypes } from '@Common/index';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { Project } from '@Routes/Project/entities';
import { TokenWhitelist } from '@Routes/Authentication/entities';
import { Nullable } from '@Types/index';

@Entity('user')
export class User extends BaseEntityWithExtras {
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

	@OneToMany(() => Project, (project) => project.owner, { onDelete: 'CASCADE' })
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
