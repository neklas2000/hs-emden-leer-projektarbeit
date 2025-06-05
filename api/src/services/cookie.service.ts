import { Injectable } from '@nestjs/common';

import { Response } from 'express';

import env from '@Environment';
import { TokensWithUserResponse } from '@Services/authentication.service';
import { DateService } from '@Services/date.service';
import { ACCESS_TOKEN_COOKIE } from '@Tokens/access-token-cookie';
import { REFRESH_TOKEN_COOKIE } from '@Tokens/refresh-token-cookie';

@Injectable()
export class CookieService {
	constructor(private readonly date: DateService) {}

	set(tokens: TokensWithUserResponse, response: Response): void {
		response.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			expires: this.date.getExpirationDateWithOffset(env.ACCESS_TOKEN_EXPIRATION),
		});

		response.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			expires: this.date.getExpirationDateWithOffset(env.REFRESH_TOKEN_EXPIRATION),
		});
	}

	clear(response: Response): void {
		response.clearCookie(ACCESS_TOKEN_COOKIE);
		response.clearCookie(REFRESH_TOKEN_COOKIE);
	}
}
