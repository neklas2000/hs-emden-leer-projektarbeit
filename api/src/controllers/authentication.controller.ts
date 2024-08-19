import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';

import { Response } from 'express';
import { Observable } from 'rxjs';

import { User } from '@Decorators/user.decorator';
import env from '@Environment';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { RefreshTokenGuard } from '@Guards/refresh-token.guard';
import {
	AuthenticationService,
	RegisterPayload,
	TokensWithUserResponse,
} from '@Services/authentication.service';
import { DateService } from '@Services/date.service';
import { ACCESS_TOKEN_COOKIE } from '@Tokens/access-token-cookie';
import { REFRESH_TOKEN_COOKIE } from '@Tokens/refresh-token-cookie';
import { Success as LogoutResult } from '@Types/success';
import { promiseToObservable } from '@Utils/promise-to-oberservable';

type AuthenticationPayload = {
	email: string;
	password: string;
};

@Controller('auth')
export class AuthenticationController {
	constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly date: DateService,
	) {}

	@Post('register')
	register(
		@Body()
		payload: RegisterPayload,
		@Res({ passthrough: true })
		res: Response,
	): Observable<TokensWithUserResponse> {
		return promiseToObservable(this.authenticationService.register(payload), (result) => {
			this.setCookies(result, res);

			return result;
		});
	}

	@Post('login')
	login(
		@Body()
		payload: AuthenticationPayload,
		@Res({ passthrough: true })
		res: Response,
	): Observable<TokensWithUserResponse> {
		return promiseToObservable(
			this.authenticationService.login(payload.email, payload.password),
			(result) => {
				this.setCookies(result, res);

				return result;
			},
		);
	}

	@UseGuards(AccessTokenGuard)
	@Post('logout')
	logout(
		@User()
		user: Express.User,
		@Res({ passthrough: true })
		res: Response,
	): Observable<LogoutResult> {
		return promiseToObservable(this.authenticationService.logout(user['sub']), (result) => {
			let success = false;

			if (result.affected && result.affected === 1) success = true;

			if (success) {
				res.clearCookie(ACCESS_TOKEN_COOKIE);
				res.clearCookie(REFRESH_TOKEN_COOKIE);
			}

			return { success } as LogoutResult;
		}) as Observable<LogoutResult>;
	}

	@UseGuards(RefreshTokenGuard)
	@Post('refresh')
	refreshTokens(
		@User()
		user: Express.User,
		@Res({ passthrough: true })
		res: Response,
	): Observable<TokensWithUserResponse> {
		const userEmail = user['email'];
		const refreshToken = user['refreshToken'];

		return promiseToObservable(
			this.authenticationService.refreshTokens(userEmail, refreshToken),
			(result) => {
				this.setCookies(result, res);

				return result;
			},
		);
	}

	private setCookies(tokens: TokensWithUserResponse, res: Response): void {
		res.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			expires: this.date.getExpirationDateWithOffset(env.ACCESS_TOKEN_EXPIRATION),
		});

		res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			expires: this.date.getExpirationDateWithOffset(env.REFRESH_TOKEN_EXPIRATION),
		});
	}
}
