import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';

import type { Response } from 'express';
import { DeepPartial } from 'typeorm';

import { User as RequestUser } from '@Common/decorators';
import { CookieService } from '@Common/services';
import { promiseToObervable } from '@Common/utils';
import { User } from '@Entities/user';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { RefreshTokenGuard } from '@Guards/refresh-token.guard';
import { AuthenticationService } from './authentication.service';

@Controller({
	path: 'auth',
	version: '1',
})
export class AuthenticationController {
	constructor(
		private readonly auth: AuthenticationService,
		private readonly cookies: CookieService,
	) {}

	@Post('register')
	register(@Body() payload: DeepPartial<User>, @Res({ passthrough: true }) res: Response) {
		return promiseToObervable(this.auth.register(payload), (tokensAndUser) => {
			this.cookies.set(tokensAndUser, res);

			return tokensAndUser;
		});
	}

	@Post('login')
	login(
		@Body() payload: Pick<User, 'emailAddress' | 'password'>,
		@Res({ passthrough: true }) res: Response,
	) {
		return promiseToObervable(
			this.auth.login(payload.emailAddress, payload.password),
			(tokensAndUser) => {
				this.cookies.set(tokensAndUser, res);

				return tokensAndUser;
			},
		);
	}

	@UseGuards(AccessTokenGuard)
	@Post('logout')
	logout(@RequestUser() user: Express.User, @Res({ passthrough: true }) res: Response) {
		return promiseToObervable(this.auth.logout(user['sub']), (successful) => {
			if (successful) {
				this.cookies.clear(res);
			}

			return successful;
		});
	}

	@UseGuards(RefreshTokenGuard)
	@Post('refresh')
	refreshTokens(@RequestUser() user: Express.User, @Res({ passthrough: true }) res: Response) {
		const userId = user['sub'];
		const refreshToken = user['refreshToken'];

		return promiseToObervable(this.auth.refreshTokens(userId, refreshToken), (result) => {
			this.cookies.set(result, res);

			return result;
		});
	}
}
