import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';

import { Response } from 'express';
import { Observable } from 'rxjs';

import { User } from '@Decorators/user.decorator';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { RefreshTokenGuard } from '@Guards/refresh-token.guard';
import {
	AuthenticationService,
	RegisterPayload,
	TokensWithUserResponse,
} from '@Services/authentication.service';
import { CookieService } from '@Services/cookie.service';
import { Success as LogoutResult } from '@Types/success';
import { promiseToObservable } from '@Utils/promise-to-oberservable';

type AuthenticationPayload = {
	email: string;
	password: string;
};

@Controller({
	path: 'auth',
	version: '1',
})
export class AuthenticationController {
	constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly cookies: CookieService,
	) {}

	@Post('register')
	register(
		@Body()
		payload: RegisterPayload,
		@Res({ passthrough: true })
		res: Response,
	): Observable<TokensWithUserResponse> {
		return promiseToObservable(this.authenticationService.register(payload), (result) => {
			this.cookies.set(result, res);

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
				this.cookies.set(result, res);

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

			if (result?.affected === 1) success = true;

			if (success) {
				this.cookies.clear(res);
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
				this.cookies.set(result, res);

				return result;
			},
		);
	}
}
