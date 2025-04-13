import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { User } from '@Entities/user';
import { JsonSchema } from 'json-schema';

@JsonSchema.Resource({ name: 'token-whitelist' })
@Entity('token_whitelist')
export class TokenWhitelist {
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
		title: 'The access token used to access resources',
	})
	@Column({ name: 'access_token', nullable: true })
	accessToken: string;

	@JsonSchema.Property({
		type: 'string',
		format: 'datetime',
		required: false,
		title: 'The expiration date of the access token',
	})
	@Column({
		name: 'access_token_expiration_date',
		type: 'datetime',
		nullable: true,
	})
	accessTokenExpirationDate: string;

	@JsonSchema.Property({
		type: 'string',
		required: false,
		title: 'The refresh token used to request a new pair of tokens',
	})
	@Column({ name: 'refresh_token', nullable: true })
	refreshToken: string;

	@JsonSchema.Property({
		type: 'string',
		format: 'datetime',
		required: false,
		title: 'The expiration date of the refresh token',
	})
	@Column({
		name: 'refresh_token_expiration_date',
		type: 'datetime',
		nullable: true,
	})
	refreshTokenExpirationDate: string;

	@JsonSchema.Relationship({
		type: 'User',
		title: 'The user who uses this pair of tokens',
	})
	@JoinColumn()
	@OneToOne(() => User, (user) => user.tokenPair, { onDelete: 'CASCADE' })
	user: User;

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}
	}
}
