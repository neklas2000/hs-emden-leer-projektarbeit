import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { type Response } from 'express';

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@Common/constants';
import { DateService } from './date.service';

@Injectable()
export class CookieService {
	constructor(
		private readonly config: ConfigService,
		private readonly date: DateService,
	) {}

	set(tokens: TokenPair, response: Response): void {
		response.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			expires: this.date.withOffset(this.config.get('ACCESS_TOKEN_EXPIRATION')),
		});

		response.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			expires: this.date.withOffset(this.config.get('REFRESH_TOKEN_EXPIRATION')),
		});
	}

	clear(response: Response): void {
		response.clearCookie(ACCESS_TOKEN_COOKIE);
		response.clearCookie(REFRESH_TOKEN_COOKIE);
	}
}
