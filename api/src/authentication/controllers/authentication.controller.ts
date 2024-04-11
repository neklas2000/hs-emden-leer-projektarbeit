import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';

import { Response } from 'express';
import { Observable } from 'rxjs';

import { User } from '@Decorators/user.decorator';
import { AccessTokenGuard, RefreshTokenGuard } from '@Guards/index';
import {
	AuthenticationService,
	TokensResponse,
	TokensWithUserResponse,
} from '@Routes/Authentication/services';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@Tokens/index';
import { promiseToObservable } from '@Utils/promise-to-oberservable';

type AuthenticationPayload = {
	email: string;
	password: string;
};

type DeleteResult = {
	success: boolean;
};

@Controller('auth')
export class AuthenticationController {
	constructor(private readonly authenticationService: AuthenticationService) {}

	@Post('register')
	register(
		@Body()
		payload: AuthenticationPayload,
	): Observable<TokensWithUserResponse> {
		return promiseToObservable(
			this.authenticationService.register(payload.email, payload.password),
		);
	}

	@Post('login')
	login(
		@Body()
		payload: AuthenticationPayload,
		@Res({ passthrough: true })
		res: Response,
	): Observable<TokensWithUserResponse> {
		const answer$ = new Promise<TokensWithUserResponse>(async (resolve) => {
			const result = await this.authenticationService.login(payload.email, payload.password);

			res.cookie(ACCESS_TOKEN_COOKIE, result.accessToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				expires: new Date(Date.now() + 30 * 60 * 1000),
			});

			res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			});

			resolve(result);
		});

		return promiseToObservable(answer$);
	}

	@UseGuards(AccessTokenGuard)
	@Post('logout')
	logout(
		@User()
		user: Express.User,
		@Res({ passthrough: true })
		res: Response,
	): Observable<DeleteResult> {
		const answer$ = new Promise<DeleteResult>(async (resolve) => {
			const result = await this.authenticationService.logout(user['sub']);

			let success = false;

			if (result.affected && result.affected === 1) success = true;

			if (success) {
				res.clearCookie(ACCESS_TOKEN_COOKIE);
				res.clearCookie(REFRESH_TOKEN_COOKIE);
			}

			resolve({
				success,
			});
		});

		return promiseToObservable(answer$);
	}

	@UseGuards(RefreshTokenGuard)
	@Post('refresh')
	refreshTokens(
		@User()
		user: Express.User,
		@Res({ passthrough: true })
		res: Response,
	): Observable<TokensResponse> {
		const userEmail = user['email'];
		const refreshToken = user['refreshToken'];

		const answer$ = new Promise<TokensResponse>(async (resolve) => {
			const result = await this.authenticationService.refreshTokens(userEmail, refreshToken);

			res.cookie(ACCESS_TOKEN_COOKIE, result.accessToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				expires: new Date(Date.now() + 30 * 60 * 1000),
			});

			res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			});

			resolve(result);
		});

		return promiseToObservable(answer$);
	}
}
