import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import type { UUID } from 'crypto';
import { Repository } from 'typeorm';

import { CryptoService, DateService } from '@Common/services';
import { TokenPair } from '@Entities/token-pair';
import { CRUDService } from '@Modules/crud.service';

@Injectable()
export class TokenWhitelistService extends CRUDService<TokenPair> {
	constructor(
		@InjectRepository(TokenPair)
		repository: Repository<TokenPair>,
		private readonly date: DateService,
		private readonly crypto: CryptoService,
		private readonly config: ConfigService,
	) {
		super(repository);
	}

	async update({ accessToken, refreshToken, user }: TokenPairWithUser<UUID>): Promise<void> {
		const accessTokenExpirationDate = this.date.withOffsetAsString(
			this.config.get('ACCESS_TOKEN_EXPIRATION'),
		);
		const refreshTokenExpirationDate = this.date.withOffsetAsString(
			this.config.get('REFRESH_TOKEN_EXPIRATION'),
		);

		const newRecord = this.repository.create({
			user: {
				id: user,
			},
			accessToken,
			accessTokenExpirationDate,
			refreshToken,
			refreshTokenExpirationDate,
		});

		await this.repository.upsert(newRecord, {
			upsertType: 'on-conflict-do-update',
			conflictPaths: {
				user: true,
			},
		});
	}

	remove(userId: UUID): Promise<boolean> {
		return this.deleteBy({
			user: {
				id: userId,
			},
		});
	}

	async verifyAccessToken(userId: UUID, accessToken: Nullable<string>): Promise<boolean> {
		const tokenPairEntry = await this.readOneBy({ user: { id: userId } });

		if (!tokenPairEntry?.accessToken) return false;
		if (!this.date.isAfterCurrentDateTime(tokenPairEntry.accessTokenExpirationDate)) return false;

		return this.crypto.hash(accessToken) === tokenPairEntry.accessToken;
	}

	async verifyRefreshToken(userId: UUID, refreshToken: Nullable<string>): Promise<boolean> {
		const tokenPairEntry = await this.readOneBy({ user: { id: userId } });

		if (!tokenPairEntry?.refreshToken) return false;
		if (!this.date.isAfterCurrentDateTime(tokenPairEntry.refreshTokenExpirationDate)) return false;

		return this.crypto.hash(refreshToken) === tokenPairEntry.refreshToken;
	}
}
