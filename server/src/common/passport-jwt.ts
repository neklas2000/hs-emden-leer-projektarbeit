import { type Request } from 'express';
import { type JwtFromRequestFunction, ExtractJwt as ExtractJwtBase } from 'passport-jwt';

interface ExtractJwtAugmentation {
	fromCookie(cookieName: string): JwtFromRequestFunction<Request>;
}

type ExtractJwtNamespace = typeof ExtractJwtBase & ExtractJwtAugmentation;

const ExtractJwt: ExtractJwtNamespace = {
	...ExtractJwtBase,
	fromCookie(cookieName: string): JwtFromRequestFunction<Request> {
		return (request) => {
			if (!request.headers?.cookie) return null;
			if (!request.headers.cookie.includes(cookieName)) return null;

			const cookies = request.headers.cookie.split(';');

			for (const cookie of cookies) {
				if (!cookie.includes(cookieName)) continue;

				return cookie.trim().substring(cookie.trim().indexOf('=') + 1);
			}

			return null;
		};
	},
};

export { ExtractJwt };
