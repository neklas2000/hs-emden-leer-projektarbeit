import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';

import env from '@Environment';
import { TokenWhitelistService } from '@Services/token-whitelist.service';
import { ACCESS_TOKEN_COOKIE } from '@Tokens/access-token-cookie';
import { Nullable } from '@Types/nullable';

type JwtPayload = {
	sub: string;
	email: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
	public static fromCookie(): JwtFromRequestFunction<Request> {
		return (req: Request): string | null => {
			if (req.cookies && Object.hasOwn(req.cookies, ACCESS_TOKEN_COOKIE)) {
				return req.cookies[ACCESS_TOKEN_COOKIE];
			}

			return null;
		};
	}

	constructor(private readonly tokenWhitelistService: TokenWhitelistService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				AccessTokenStrategy.fromCookie(),
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			secretOrKey: env.JWT_ACCESS_SECRET,
			passReqToCallback: true,
		});
	}

	async validate(@Req() request: Request, payload: JwtPayload) {
		let accessToken: Nullable<string> = AccessTokenStrategy.fromCookie()(request);

		if (!accessToken) {
			accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
		}

		const verified = await this.tokenWhitelistService.verifyAccessToken(payload.sub, accessToken);

		if (!verified) {
			throw new UnauthorizedException();
		}

		return payload;
	}
}
