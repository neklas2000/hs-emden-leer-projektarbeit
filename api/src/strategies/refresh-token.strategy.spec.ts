jest.mock('passport-jwt', () => ({
	__esModule: true,
	ExtractJwt: {
		fromAuthHeaderAsBearerToken: jest.fn(),
		fromExtractors: jest.fn(),
	},
	Strategy: class {},
}));

import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { ExtractJwt } from 'passport-jwt';

import { TokenWhitelistService } from '@Routes/Authentication/services';
import { provideTokenWhitelistRepository } from '@Mocks/Providers/token-whitelist-repository.provider';
import { REFRESH_TOKEN_COOKIE } from '@Tokens/index';
import { RefreshTokenStrategy } from './refresh-token.strategy';

describe('Strategy: RefreshTokenStrategy', () => {
	const PREVIOUS_PROCESS_ENVIRONMENT = process.env;
	let strategy: RefreshTokenStrategy;
	let tokenWhitelist: TokenWhitelistService;

	beforeEach(async () => {
		jest.resetModules();
		process.env = { ...PREVIOUS_PROCESS_ENVIRONMENT };
		process.env.JWT_REFRESH_SECRET = 'jwt refresh token secret';

		const module = await Test.createTestingModule({
			providers: [RefreshTokenStrategy, TokenWhitelistService, provideTokenWhitelistRepository()],
		}).compile();

		tokenWhitelist = module.get(TokenWhitelistService);
		strategy = module.get(RefreshTokenStrategy);
	});

	afterAll(() => {
		process.env = PREVIOUS_PROCESS_ENVIRONMENT;
	});

	it('should be created', () => {
		expect(strategy).toBeTruthy();
	});

	it('should extract the refresh token from a cookie', () => {
		const request = {
			cookies: {
				[REFRESH_TOKEN_COOKIE]: 'refreshToken',
			},
		} as any;
		const extractAccessToken = RefreshTokenStrategy.fromCookie();

		expect(extractAccessToken(request)).toEqual('refreshToken');
	});

	it('should try to extract the refresh token from a cookie and return null', () => {
		const request = {
			cookies: {},
		} as any;
		const extractAccessToken = RefreshTokenStrategy.fromCookie();

		expect(extractAccessToken(request)).toBeNull();
	});

	it('should throw an exception since the verification failed', (done) => {
		const extractor = jest.fn().mockReturnValue('refreshToken');
		(ExtractJwt.fromAuthHeaderAsBearerToken as jest.Mock).mockReturnValue(extractor);
		jest.spyOn(tokenWhitelist, 'verifyRefreshToken').mockResolvedValue(false);

		strategy
			.validate({} as any, {
				sub: '1',
				email: 'max.mustermann@gmx.de',
			})
			.catch((exception) => {
				expect(ExtractJwt.fromAuthHeaderAsBearerToken).toHaveBeenCalled();
				expect(extractor).toHaveBeenCalledWith({});
				expect(tokenWhitelist.verifyRefreshToken).toHaveBeenCalledWith('1', 'refreshToken');
				expect(exception).toBeInstanceOf(UnauthorizedException);

				done();
			});
	});

	it('should verify the refresh token', (done) => {
		const extractor = jest.fn().mockReturnValue('refreshToken');
		(ExtractJwt.fromAuthHeaderAsBearerToken as jest.Mock).mockReturnValue(extractor);
		jest.spyOn(tokenWhitelist, 'verifyRefreshToken').mockResolvedValue(true);

		strategy
			.validate({} as any, {
				sub: '1',
				email: 'max.mustermann@gmx.de',
			})
			.then((result) => {
				expect(ExtractJwt.fromAuthHeaderAsBearerToken).toHaveBeenCalled();
				expect(extractor).toHaveBeenCalledWith({});
				expect(tokenWhitelist.verifyRefreshToken).toHaveBeenCalledWith('1', 'refreshToken');
				expect(result).toEqual({
					sub: '1',
					email: 'max.mustermann@gmx.de',
					refreshToken: 'refreshToken',
				});

				done();
			});
	});
});
