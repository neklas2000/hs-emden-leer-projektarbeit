import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { User } from '@Entities/user';

@Entity('token_whitelist')
export class TokenWhitelist {
	@PrimaryGeneratedUUID()
	id: string;

	@Column({ name: 'access_token', nullable: true })
	accessToken: string;

	@Column({
		name: 'access_token_expiration_date',
		type: 'datetime',
		nullable: true,
	})
	accessTokenExpirationDate: string;

	@Column({ name: 'refresh_token', nullable: true })
	refreshToken: string;

	@Column({
		name: 'refresh_token_expiration_date',
		type: 'datetime',
		nullable: true,
	})
	refreshTokenExpirationDate: string;

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
