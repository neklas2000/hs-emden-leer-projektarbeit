import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import env from '@Environment';
import { TokenWhitelistService } from '@Routes/Authentication/services';
import { REFRESH_TOKEN_COOKIE } from '@Tokens/index';
import { Nullable } from '@Types/index';

type JwtPayload = {
	sub: string;
	email: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	public static fromCookie() {
		return (req: Request): string | null => {
			if (req.cookies && Object.hasOwn(req.cookies, REFRESH_TOKEN_COOKIE)) {
				return req.cookies[REFRESH_TOKEN_COOKIE];
			}

			return null;
		};
	}

	constructor(private readonly tokenWhitelistService: TokenWhitelistService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				RefreshTokenStrategy.fromCookie(),
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			secretOrKey: env.JWT_REFRESH_SECRET,
			passReqToCallback: true,
		});
	}

	async validate(@Req() request: Request, payload: JwtPayload) {
		let refreshToken: Nullable<string> = RefreshTokenStrategy.fromCookie()(request);

		if (!refreshToken) {
			refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
		}

		const verified = await this.tokenWhitelistService.verifyRefreshToken(payload.sub, refreshToken);

		if (!verified) {
			throw new UnauthorizedException();
		}

		return {
			...payload,
			refreshToken,
		};
	}
}
