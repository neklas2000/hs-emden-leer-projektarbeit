import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { CommonEntityFields } from './common-entity-fields';
import { User } from './user';

@Entity('token_pairs')
export class TokenPair extends CommonEntityFields {
	@Column({
		name: 'access_token',
		nullable: true,
		type: 'varchar',
	})
	accessToken: string;

	@Column({
		name: 'access_token_expiration_date',
		nullable: true,
		type: 'datetime',
	})
	accessTokenExpirationDate: string;

	@Column({
		name: 'refresh_token',
		nullable: true,
		type: 'varchar',
	})
	refreshToken: string;

	@Column({
		name: 'refresh_token_expiration_date',
		nullable: true,
		type: 'datetime',
	})
	refreshTokenExpirationDate: string;

	@OneToOne(() => User, (user) => user.tokenPair, { onDelete: 'CASCADE' })
	@JoinColumn()
	user: User;
}
