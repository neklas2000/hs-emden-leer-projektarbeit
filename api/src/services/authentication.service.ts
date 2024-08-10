import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { DeepPartial, DeleteResult } from 'typeorm';

import { User } from '@Entities/user';
import env from '@Environment';
import { BadRequestException } from '@Exceptions/bad-request.exception';
import { IncorrectCredentialsException } from '@Exceptions/incorrect-credentials.exception';
import { UserAlreadyExistsException } from '@Exceptions/user-already-exists.exception';
import { CryptoService } from '@Services/crypto.service';
import { TokenPairAndOwner, TokenWhitelistService } from '@Services/token-whitelist.service';
import { UserService } from '@Services/user.service';

export type RegisterPayload = DeepPartial<User> & {
	email: string;
	password: string;
};

export type TokensResponse = {
	accessToken: string;
	refreshToken: string;
};

export type TokensWithUserResponse = TokensResponse & {
	user: DeepPartial<User>;
};

@Injectable()
export class AuthenticationService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly tokenWhitelistService: TokenWhitelistService,
		private readonly crypto: CryptoService,
	) {}

	async register({
		email,
		password,
		...userData
	}: RegisterPayload): Promise<TokensWithUserResponse> {
		const user = await this.userService.findByEmail(email);

		if (user !== null) {
			throw new UserAlreadyExistsException(email, null);
		}

		const registeredUser = await this.userService.register({
			email,
			password: this.crypto.hash(password),
			...userData,
		});
		delete registeredUser.password;

		const tokens = await this.generateTokens(registeredUser.id, registeredUser.email);
		await this.updateWhitelistedTokens({
			...tokens,
			userId: registeredUser.id,
		});

		return {
			...tokens,
			user: registeredUser,
		};
	}

	async login(email: string, password: string): Promise<TokensWithUserResponse> {
		const user = await this.userService.findByEmail(email);

		if (!user || user.password !== this.crypto.hash(password)) {
			throw new IncorrectCredentialsException(null);
		}

		const userWithoutPassword: DeepPartial<User> = user;
		delete userWithoutPassword.password;

		const tokens = await this.generateTokens(userWithoutPassword.id, userWithoutPassword.email);
		await this.updateWhitelistedTokens({
			...tokens,
			userId: userWithoutPassword.id,
		});

		return {
			...tokens,
			user: userWithoutPassword,
		};
	}

	logout(userId: string): Promise<DeleteResult> {
		return this.tokenWhitelistService.delete(userId);
	}

	async refreshTokens(email: string, refreshToken: string): Promise<TokensWithUserResponse> {
		const user = await this.userService.findByEmail(email);

		if (!user) {
			throw new ForbiddenException('Access Denied');
		}

		delete user.password;
		const tokenWhitelistEntry = await this.tokenWhitelistService.findByUser(user.id);

		if (!tokenWhitelistEntry) {
			throw new ForbiddenException('Access Denied');
		}

		const hashedRefreshedToken = this.crypto.hash(refreshToken);

		if (hashedRefreshedToken !== tokenWhitelistEntry.refreshToken) {
			throw new ForbiddenException('Access Denied');
		}

		const tokens = await this.generateTokens(user.id, user.email);
		await this.updateWhitelistedTokens({
			...tokens,
			userId: user.id,
		});

		return {
			...tokens,
			user,
		};
	}

	private async generateTokens(userId: string, email: string): Promise<TokensResponse> {
		try {
			const [accessToken, refreshToken] = await Promise.all([
				this.jwtService.signAsync(
					{
						sub: userId,
						email,
					},
					{
						secret: env.JWT_ACCESS_SECRET,
						expiresIn: env.ACCESS_TOKEN_EXPIRATION,
					},
				),
				this.jwtService.signAsync(
					{
						sub: userId,
						email,
					},
					{
						secret: env.JWT_REFRESH_SECRET,
						expiresIn: env.REFRESH_TOKEN_EXPIRATION,
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
		refreshToken,
		accessToken,
		userId,
	}: TokenPairAndOwner): Promise<void> {
		const hashedRefreshedToken = this.crypto.hash(refreshToken);
		const hashedAccessToken = this.crypto.hash(accessToken);

		await this.tokenWhitelistService.update({
			userId,
			accessToken: hashedAccessToken,
			refreshToken: hashedRefreshedToken,
		});
	}
}
