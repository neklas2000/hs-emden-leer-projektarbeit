import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';

import { TokenWhitelist } from '@Entities/token-whitelist';
import env from '@Environment';
import { CryptoService } from '@Services/crypto.service';
import { DateService } from '@Services/date.service';

export type TokenPairAndOwner = {
	accessToken: string;
	refreshToken: string;
	userId: string;
};

@Injectable()
export class TokenWhitelistService {
	constructor(
		@InjectRepository(TokenWhitelist)
		private readonly tokenWhitelistRepository: Repository<TokenWhitelist>,
		private readonly date: DateService,
		private readonly crypto: CryptoService,
	) {}

	async update({ accessToken, refreshToken, userId }: TokenPairAndOwner): Promise<void> {
		const tokenWhitelistEntry = await this.findByUser(userId);

		if (tokenWhitelistEntry !== null) {
			await this.tokenWhitelistRepository.remove(tokenWhitelistEntry);
		}

		const accessTokenExpirationDate = this.date.getCurrentTimestampWithOffset(
			env.ACCESS_TOKEN_EXPIRATION,
		);
		const refreshTokenExpirationDate = this.date.getCurrentTimestampWithOffset(
			env.REFRESH_TOKEN_EXPIRATION,
		);

		const newRecord = this.tokenWhitelistRepository.create({
			user: {
				id: userId,
			},
			accessToken,
			accessTokenExpirationDate,
			refreshToken,
			refreshTokenExpirationDate,
		});

		await this.tokenWhitelistRepository.save(newRecord);
	}

	delete(userId: string): Promise<DeleteResult> {
		return this.tokenWhitelistRepository.delete({
			user: {
				id: userId,
			},
		});
	}

	findByUser(userId: string): Promise<TokenWhitelist> {
		return this.tokenWhitelistRepository.findOne({
			where: {
				user: {
					id: userId,
				},
			},
		});
	}

	async verifyAccessToken(userId: string, accessToken: string): Promise<boolean> {
		const tokenWhitelistEntry = await this.findByUser(userId);

		if (tokenWhitelistEntry === null) return false;
		if (tokenWhitelistEntry.accessToken === null) return false;
		if (!this.date.isAfterCurrentTimestamp(tokenWhitelistEntry.accessTokenExpirationDate)) {
			return false;
		}

		const hashedAccessToken = this.crypto.hash(accessToken);

		return tokenWhitelistEntry.accessToken === hashedAccessToken;
	}

	async verifyRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
		const tokenWhitelistEntry = await this.findByUser(userId);

		if (tokenWhitelistEntry === null) return false;
		if (tokenWhitelistEntry.refreshToken === null) return false;
		if (!this.date.isAfterCurrentTimestamp(tokenWhitelistEntry.refreshTokenExpirationDate)) {
			return false;
		}

		const hashedRefreshToken = this.crypto.hash(refreshToken);

		return tokenWhitelistEntry.refreshToken === hashedRefreshToken;
	}
}
