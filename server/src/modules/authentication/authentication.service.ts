import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { type UUID } from 'crypto';
import { DeepPartial } from 'typeorm';

import { CryptoService } from '@Common/services';
import { omit } from '@Common/utils';
import { User } from '@Entities/user';
import { AccessDeniedException } from '@Exceptions/access-denied.exception';
import { BadRequestException } from '@Exceptions/bad-request.exception';
import { IncorrectCredentialsException } from '@Exceptions/incorrect-credentials.exception';
import { UserAlreadyExistsException } from '@Exceptions/user-already-exists.exception';
import { AppSettingsService } from '@Modules/app-settings/app-settings.service';
import { UserService } from '@Modules/user/user.service';
import { TokenWhitelistService } from './token-whitelist.service';

@Injectable()
export class AuthenticationService {
	constructor(
		private readonly users: UserService,
		private readonly jwt: JwtService,
		private readonly tokenWhitelist: TokenWhitelistService,
		private readonly crypto: CryptoService,
		private readonly config: ConfigService,
		private readonly appSettings: AppSettingsService,
	) {}

	async register({
		emailAddress,
		password,
		...userData
	}: DeepPartial<User>): Promise<TokenPairWithUser<User>> {
		const user = await this.users.findByEmailAddress(emailAddress);

		if (user) {
			throw new UserAlreadyExistsException();
		}

		const registeredUser = await this.users.register({
			emailAddress,
			password: this.crypto.hash(password),
			...userData,
		});
		const userWithoutPassword = omit(registeredUser, 'password');

		const tokens = await this.generateTokens(
			<UUID>userWithoutPassword.id,
			userWithoutPassword.emailAddress,
		);
		await this.updateWhitelistedTokens({
			...tokens,
			user: <UUID>registeredUser.id,
		});
		await this.appSettings.initializeForNewlyRegisteredUser(<UUID>registeredUser.id);

		return {
			...tokens,
			user: registeredUser,
		};
	}

	async login(emailAddress: string, password: string): Promise<TokenPairWithUser<User>> {
		const user = await this.users.findByEmailAddress(emailAddress);

		if (!user || user.password !== this.crypto.hash(password)) {
			throw new IncorrectCredentialsException();
		}

		delete user.password;
		const tokens = await this.generateTokens(<UUID>user.id, emailAddress);
		await this.updateWhitelistedTokens({
			...tokens,
			user: <UUID>user.id,
		});

		return {
			...tokens,
			user,
		};
	}

	logout(userId: UUID): Promise<boolean> {
		return this.tokenWhitelist.remove(userId);
	}

	async refreshTokens(
		userId: UUID,
		refreshToken: string,
	): Promise<TokenPairWithUser<Omit<User, 'password'>>> {
		const existingUser = await this.users.readOne(userId);

		if (!existingUser) {
			throw new AccessDeniedException();
		}

		const user = omit(existingUser, 'password');
		const tokenPair = await this.tokenWhitelist.readOneBy({ user: { id: existingUser.id } });

		if (!tokenPair || tokenPair.refreshToken !== this.crypto.hash(refreshToken)) {
			throw new AccessDeniedException();
		}

		const tokens = await this.generateTokens(<UUID>user.id, existingUser.emailAddress);
		await this.updateWhitelistedTokens({
			...tokens,
			user: <UUID>user.id,
		});

		return {
			...tokens,
			user,
		};
	}

	private async generateTokens(userId: UUID, email: string): Promise<TokenPair> {
		try {
			const [accessToken, refreshToken] = await Promise.all([
				this.jwt.signAsync(
					{
						sub: userId,
						id: userId,
						email,
					},
					{
						secret: this.config.get('JWT_ACCESS_SECRET'),
						expiresIn: this.config.get('ACCESS_TOKEN_EXPIRATION'),
					},
				),
				this.jwt.signAsync(
					{
						sub: userId,
						id: userId,
						email,
					},
					{
						secret: this.config.get('JWT_REFRESH_SECRET'),
						expiresIn: this.config.get('REFRESH_TOKEN_EXPIRATION'),
					},
				),
			]);

			return {
				accessToken,
				refreshToken,
			};
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	private async updateWhitelistedTokens({
		accessToken,
		refreshToken,
		user,
	}: TokenPairWithUser<UUID>): Promise<void> {
		this.tokenWhitelist.update({
			accessToken: this.crypto.hash(accessToken),
			refreshToken: this.crypto.hash(refreshToken),
			user,
		});
	}
}
