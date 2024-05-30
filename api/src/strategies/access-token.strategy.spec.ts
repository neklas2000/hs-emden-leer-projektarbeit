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

import { AccessTokenStrategy } from './access-token.strategy';
import { TokenWhitelistService } from '@Routes/Authentication/services';
import { provideTokenWhitelistRepository } from '@Mocks/Providers/token-whitelist-repository.provider';
import { ACCESS_TOKEN_COOKIE } from '@Tokens/index';
import { DateService } from '@Services/date.service';
import { CryptoService } from '@Services/crypto.service';

describe('Strategy: AccessTokenStrategy', () => {
	const PREVIOUS_PROCESS_ENVIRONMENT = process.env;
	let strategy: AccessTokenStrategy;
	let tokenWhitelist: TokenWhitelistService;

	beforeEach(async () => {
		jest.resetModules();
		process.env = { ...PREVIOUS_PROCESS_ENVIRONMENT };
		process.env.JWT_ACCESS_SECRET = 'jwt access token secret';

		const module = await Test.createTestingModule({
			providers: [
				AccessTokenStrategy,
				TokenWhitelistService,
				provideTokenWhitelistRepository(),
				DateService,
				CryptoService,
			],
		}).compile();

		tokenWhitelist = module.get(TokenWhitelistService);
		strategy = module.get(AccessTokenStrategy);
	});

	afterAll(() => {
		process.env = PREVIOUS_PROCESS_ENVIRONMENT;
	});

	it('should be created', () => {
		expect(strategy).toBeTruthy();
	});

	it('should extract the access token from a cookie', () => {
		const request = {
			cookies: {
				[ACCESS_TOKEN_COOKIE]: 'accessToken',
			},
		} as any;
		const extractAccessToken = AccessTokenStrategy.fromCookie();

		expect(extractAccessToken(request)).toEqual('accessToken');
	});

	it('should try to extract the access token from a cookie and return null', () => {
		const request = {
			cookies: {},
		} as any;
		const extractAccessToken = AccessTokenStrategy.fromCookie();

		expect(extractAccessToken(request)).toBeNull();
	});

	it('should throw an exception since the verification failed', (done) => {
		const extractor = jest.fn().mockReturnValue('accessToken');
		(ExtractJwt.fromAuthHeaderAsBearerToken as jest.Mock).mockReturnValue(extractor);
		jest.spyOn(tokenWhitelist, 'verifyAccessToken').mockResolvedValue(false);

		strategy
			.validate({} as any, {
				sub: '1',
				email: 'max.mustermann@gmx.de',
			})
			.catch((exception) => {
				expect(ExtractJwt.fromAuthHeaderAsBearerToken).toHaveBeenCalled();
				expect(extractor).toHaveBeenCalledWith({});
				expect(tokenWhitelist.verifyAccessToken).toHaveBeenCalledWith('1', 'accessToken');
				expect(exception).toBeInstanceOf(UnauthorizedException);

				done();
			});
	});

	it('should verify the access token', (done) => {
		const extractor = jest.fn().mockReturnValue('accessToken');
		(ExtractJwt.fromAuthHeaderAsBearerToken as jest.Mock).mockReturnValue(extractor);
		jest.spyOn(tokenWhitelist, 'verifyAccessToken').mockResolvedValue(true);

		strategy
			.validate({} as any, {
				sub: '1',
				email: 'max.mustermann@gmx.de',
			})
			.then((result) => {
				expect(ExtractJwt.fromAuthHeaderAsBearerToken).toHaveBeenCalled();
				expect(extractor).toHaveBeenCalledWith({});
				expect(tokenWhitelist.verifyAccessToken).toHaveBeenCalledWith('1', 'accessToken');
				expect(result).toEqual({
					sub: '1',
					email: 'max.mustermann@gmx.de',
				});

				done();
			});
	});
});
