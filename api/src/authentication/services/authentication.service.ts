import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';

import * as crypto from 'crypto-js';
import { DeepPartial, DeleteResult } from 'typeorm';

import { IncorrectCredentialsException, UserAlreadyExistsException } from '@Exceptions/index';
import { UserService } from '@Routes/User/services';
import { User } from '@Routes/User/entities';
import { TokenPairAndOwner, TokenWhitelistService } from './token-whitelist.service';

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
	) {}

	async register({ email, ...userData }: RegisterPayload): Promise<TokensWithUserResponse> {
		const user = await this.userService.findByEmail(email);

		if (user !== null) {
			throw new UserAlreadyExistsException(email, null);
		}

		const registeredUser = await this.userService.register({ email, ...userData });
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

		if (!user || user.password !== password) {
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

	async refreshTokens(email: string, refreshToken: string): Promise<TokensResponse> {
		const user = await this.userService.findByEmail(email);

		if (!user) {
			throw new ForbiddenException('Access Denied');
		}

		const tokenWhitelistEntry = await this.tokenWhitelistService.findByUser(user.id);

		if (!tokenWhitelistEntry) {
			throw new ForbiddenException('Access Denied');
		}

		const hashedRefreshedToken = crypto.SHA256(refreshToken).toString(crypto.enc.Hex);

		if (hashedRefreshedToken !== tokenWhitelistEntry.refreshToken) {
			throw new ForbiddenException('Access Denied');
		}

		const tokens = await this.generateTokens(user.id, user.email);
		await this.updateWhitelistedTokens({
			...tokens,
			userId: user.id,
		});

		return tokens;
	}

	async updateWhitelistedTokens({
		refreshToken,
		accessToken,
		userId,
	}: TokenPairAndOwner): Promise<void> {
		const hashedRefreshedToken = crypto.SHA256(refreshToken).toString(crypto.enc.Hex);
		const hashedAccessToken = crypto.SHA256(accessToken).toString(crypto.enc.Hex);

		await this.tokenWhitelistService.update({
			userId,
			accessToken: hashedAccessToken,
			refreshToken: hashedRefreshedToken,
		});
	}

	async generateTokens(userId: string, email: string): Promise<TokensResponse> {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{
					sub: userId,
					email,
				},
				{
					secret: process.env.JWT_ACCESS_SECRET,
					expiresIn: '30m',
				},
			),
			this.jwtService.signAsync(
				{
					sub: userId,
					email,
				},
				{
					secret: process.env.JWT_REFRESH_SECRET,
					expiresIn: '7d',
				},
			),
		]);

		return {
			accessToken,
			refreshToken,
		};
	}
}
