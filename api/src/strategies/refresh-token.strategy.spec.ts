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

import { CryptoService } from '@Services/crypto.service';
import { DateService } from '@Services/date.service';
import { TokenWhitelistService } from '@Services/token-whitelist.service';
import { RefreshTokenStrategy } from '@Strategies/refresh-token.strategy';
import { provideTokenWhitelistRepository } from '@Test/Providers/token-whitelist-repository.provider';
import { REFRESH_TOKEN_COOKIE } from '@Tokens/refresh-token-cookie';

describe('Strategy: RefreshTokenStrategy', () => {
	let oldEnvironment: NodeJS.ProcessEnv;
	let strategy: RefreshTokenStrategy;
	let tokenWhitelist: TokenWhitelistService;

	beforeAll(() => {
		oldEnvironment = process.env;
		process.env.JWT_REFRESH_SECRET = 'jwt refresh token secret';
		jest.resetModules();
	});

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				RefreshTokenStrategy,
				TokenWhitelistService,
				provideTokenWhitelistRepository(),
				DateService,
				CryptoService,
			],
		}).compile();

		tokenWhitelist = module.get(TokenWhitelistService);
		strategy = module.get(RefreshTokenStrategy);
	});

	afterAll(() => {
		process.env = oldEnvironment;
	});

	it('should create', () => {
		expect(strategy).toBeTruthy();
	});

	describe('fromCookie(): JwtFromRequestFunction<Request>', () => {
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
	});

	describe('validate(Request, JwtPayload): JwtPayload', () => {
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
});
