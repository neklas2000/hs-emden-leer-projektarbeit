import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';

import { text } from '@Common/utils/text-node';
import { JsonSchema } from '@JsonSchema/lib';
import { CommonEntityFields } from './common-entity-fields';
import { File } from './file';
import { TokenPair } from './token-pair';
import { Project } from './project';
import { AppSettings } from './app-settings';

@JsonSchema.Resource({
	name: 'users',
	title: 'A blueprint of an user',
	description: text`This resource represents an user using this app with his details.`,
})
@Entity('users')
@Index(['academicTitle', 'firstName', 'lastName'])
export class User extends CommonEntityFields {
	@JsonSchema.Property({
		type: 'string',
		title: 'The academic title of an user.',
		description: text`
			This property can store the academic title of an user if present.
			An academic title could be "Prof. Dr.", "M. Sc.", "B. Sc." etc.
		`,
		required: false,
	})
	@Column({
		name: 'academic_title',
		nullable: true,
		type: 'varchar',
		length: 50,
	})
	academicTitle: string;

	@JsonSchema.Property({ type: 'number', format: 'int' })
	@Column({
		name: 'matriculation_number',
		nullable: true,
		type: 'int',
		scale: 11,
	})
	matriculationNumber: number;

	@Column({
		name: 'first_name',
		nullable: true,
		type: 'varchar',
		length: 50,
	})
	firstName: string;

	@Column({
		name: 'last_name',
		nullable: true,
		type: 'varchar',
		length: 50,
	})
	lastName: string;

	@Column({
		name: 'email_address',
		type: 'varchar',
		length: 100,
	})
	emailAddress: string;

	@Column({
		name: 'email_verified',
		type: 'tinyint',
		default: false,
	})
	emailVerified: boolean;

	@Column({ type: 'varchar' })
	password: string;

	@Column({
		name: 'phone_number',
		nullable: true,
		type: 'varchar',
	})
	phoneNumber: string;

	@OneToMany(() => Project, (project) => project.owner)
	projects: Project[];

	@OneToOne(() => TokenPair, (tokenPair) => tokenPair.user)
	tokenPair: TokenPair;

	@OneToOne(() => AppSettings, (appSettings) => appSettings.user)
	appSettings: AppSettings;

	@OneToMany(() => File, (file) => file.uploadedBy)
	files: File[];
}
