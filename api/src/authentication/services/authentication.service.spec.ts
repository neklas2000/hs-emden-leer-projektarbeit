jest.mock('@Environment', () => ({
	__esModule: true,
	default: {
		JWT_ACCESS_SECRET: 'jwt access token secret',
		JWT_REFRESH_SECRET: 'jwt refresh token secret',
		ACCESS_TOKEN_EXPIRATION: '30m',
		REFRESH_TOKEN_EXPIRATION: '7d',
	},
}));

import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { AuthenticationService } from './authentication.service';
import { TokenWhitelistService } from './token-whitelist.service';
import { UserService } from '@Routes/User/services';
import { provideTokenWhitelistRepository } from '@Mocks/Providers/token-whitelist-repository.provider';
import { provideUserRepository } from '@Mocks/Providers/user-repository.provider';
import { IncorrectCredentialsException } from '@Exceptions/incorrect-credentials.exception';
import { UserAlreadyExistsException } from '@Exceptions/user-already-exists.exception';
import { CryptoService } from '@Services/crypto.service';
import { DateService } from '@Services/date.service';

describe('Service: AuthenticationService', () => {
	let service: AuthenticationService;
	let userService: UserService;
	let jwtService: JwtService;
	let tokenWhitelist: TokenWhitelistService;
	let cryptoService: CryptoService;

	beforeEach(async () => {
		jest.resetModules();

		const module = await Test.createTestingModule({
			providers: [
				AuthenticationService,
				TokenWhitelistService,
				JwtService,
				UserService,
				provideTokenWhitelistRepository(),
				provideUserRepository(),
				CryptoService,
				DateService,
			],
		}).compile();

		userService = module.get(UserService);
		jwtService = module.get(JwtService);
		tokenWhitelist = module.get(TokenWhitelistService);
		cryptoService = module.get(CryptoService);
		service = module.get(AuthenticationService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('register(string, string)', () => {
		it('should throw an exception since the user already exists', (done) => {
			jest.spyOn(userService, 'findByEmail').mockResolvedValue({} as any);
			jest.spyOn(userService, 'register');

			service
				.register({ email: 'max.mustermann@gmx.de', password: 'secure password' })
				.catch((exception) => {
					expect(userService.findByEmail).toHaveBeenCalledWith('max.mustermann@gmx.de');
					expect(userService.register).not.toHaveBeenCalled();
					expect(exception).toBeInstanceOf(UserAlreadyExistsException);

					done();
				});
		});

		it('should register a new user and return the tokens', (done) => {
			jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
			jest.spyOn(cryptoService, 'hash').mockReturnValueOnce('secure password');
			jest.spyOn(userService, 'register').mockResolvedValue({
				id: '1',
				email: 'max.mustermann@gmx.de',
				password: 'secure password',
			} as any);
			jest.spyOn(service, 'generateTokens').mockResolvedValue({
				accessToken: 'accessToken',
				refreshToken: 'refreshToken',
			});
			jest.spyOn(service, 'updateWhitelistedTokens').mockImplementation(() => Promise.resolve());

			service
				.register({ email: 'max.mustermann@gmx.de', password: 'secure password' })
				.then((result) => {
					expect(userService.findByEmail).toHaveBeenCalledWith('max.mustermann@gmx.de');
					expect(userService.register).toHaveBeenCalledWith({
						email: 'max.mustermann@gmx.de',
						password: 'secure password',
					});
					expect(service.generateTokens).toHaveBeenCalledWith('1', 'max.mustermann@gmx.de');
					expect(service.updateWhitelistedTokens).toHaveBeenCalledWith({
						accessToken: 'accessToken',
						refreshToken: 'refreshToken',
						userId: '1',
					});
					expect(result).toEqual({
						accessToken: 'accessToken',
						refreshToken: 'refreshToken',
						user: {
							id: '1',
							email: 'max.mustermann@gmx.de',
						},
					});

					done();
				});
		});
	});

	describe('login(string, string)', () => {
		it('should throw an exception since no user could be found', (done) => {
			jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
			jest.spyOn(service, 'generateTokens');

			service.login('max.mustermann@gmx.de', 'secure password').catch((exception) => {
				expect(userService.findByEmail).toHaveBeenCalledWith('max.mustermann@gmx.de');
				expect(service.generateTokens).not.toHaveBeenCalled();
				expect(exception).toBeInstanceOf(IncorrectCredentialsException);

				done();
			});
		});

		it('should throw an exception since the passwords do not equal', (done) => {
			jest.spyOn(userService, 'findByEmail').mockResolvedValue({
				password: 'different password',
			} as any);
			jest.spyOn(service, 'generateTokens');

			service.login('max.mustermann@gmx.de', 'secure password').catch((exception) => {
				expect(userService.findByEmail).toHaveBeenCalledWith('max.mustermann@gmx.de');
				expect(service.generateTokens).not.toHaveBeenCalled();
				expect(exception).toBeInstanceOf(IncorrectCredentialsException);

				done();
			});
		});

		it('should login the user and return the generated tokens', (done) => {
			jest.spyOn(userService, 'findByEmail').mockResolvedValue({
				id: '1',
				email: 'max.mustermann@gmx.de',
				password: 'secure password',
			} as any);
			jest.spyOn(cryptoService, 'hash').mockReturnValueOnce('secure password');
			jest.spyOn(service, 'generateTokens').mockResolvedValue({
				accessToken: 'accessToken',
				refreshToken: 'refreshToken',
			});
			jest.spyOn(service, 'updateWhitelistedTokens').mockResolvedValue(null);

			service.login('max.mustermann@gmx.de', 'secure password').then((result) => {
				expect(userService.findByEmail).toHaveBeenCalledWith('max.mustermann@gmx.de');
				expect(service.generateTokens).toHaveBeenCalledWith('1', 'max.mustermann@gmx.de');
				expect(service.updateWhitelistedTokens).toHaveBeenCalledWith({
					accessToken: 'accessToken',
					refreshToken: 'refreshToken',
					userId: '1',
				});
				expect(result).toEqual({
					accessToken: 'accessToken',
					refreshToken: 'refreshToken',
					user: {
						id: '1',
						email: 'max.mustermann@gmx.de',
					},
				});

				done();
			});
		});
	});

	describe('logout(string)', () => {
		it('should logout an user', (done) => {
			const expectedResponse = {
				affected: 1,
				raw: '',
			};
			jest.spyOn(tokenWhitelist, 'delete').mockResolvedValue(expectedResponse);

			service.logout('1').then((result) => {
				expect(tokenWhitelist.delete).toHaveBeenCalled();
				expect(tokenWhitelist.delete).toHaveBeenCalledWith('1');
				expect(result).toEqual(expectedResponse);

				done();
			});
		});
	});

	describe('refreshTokens(string, string)', () => {
		it('should throw an exception since no user could be found', (done) => {
			jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
			jest.spyOn(tokenWhitelist, 'findByUser');

			service.refreshTokens('max.mustermann@gmx.de', 'refreshToken').catch((exception) => {
				expect(userService.findByEmail).toHaveBeenCalledWith('max.mustermann@gmx.de');
				expect(tokenWhitelist.findByUser).not.toHaveBeenCalled();
				expect(exception).toBeInstanceOf(ForbiddenException);

				done();
			});
		});

		it('should throw an exception since no entry in the token whitelist could be found', (done) => {
			jest.spyOn(userService, 'findByEmail').mockResolvedValue({
				id: '1',
				email: 'max.mustermann@gmx.de',
			} as any);
			jest.spyOn(tokenWhitelist, 'findByUser').mockResolvedValue(null);

			service.refreshTokens('max.mustermann@gmx.de', 'refreshToken').catch((exception) => {
				expect(userService.findByEmail).toHaveBeenCalledWith('max.mustermann@gmx.de');
				expect(tokenWhitelist.findByUser).toHaveBeenCalledWith('1');
				expect(exception).toBeInstanceOf(ForbiddenException);

				done();
			});
		});

		it('should throw an exception since the refresh tokens do not equal', (done) => {
			jest.spyOn(userService, 'findByEmail').mockResolvedValue({
				id: '1',
				email: 'max.mustermann@gmx.de',
			} as any);
			jest.spyOn(tokenWhitelist, 'findByUser').mockResolvedValue({
				refreshToken: 'different hashed refreshToken',
			} as any);
			jest.spyOn(service, 'generateTokens');

			service.refreshTokens('max.mustermann@gmx.de', 'refreshToken').catch((exception) => {
				expect(userService.findByEmail).toHaveBeenCalledWith('max.mustermann@gmx.de');
				expect(tokenWhitelist.findByUser).toHaveBeenCalledWith('1');
				expect(service.generateTokens).not.toHaveBeenCalled();
				expect(exception).toBeInstanceOf(ForbiddenException);

				done();
			});
		});

		it('should refresh the token pair', (done) => {
			jest.spyOn(userService, 'findByEmail').mockResolvedValue({
				id: '1',
				email: 'max.mustermann@gmx.de',
				password: 'secret password',
			} as any);
			jest.spyOn(tokenWhitelist, 'findByUser').mockResolvedValue({
				refreshToken: 'hashed refreshToken',
			} as any);
			jest.spyOn(cryptoService, 'hash').mockReturnValueOnce('hashed refreshToken');
			const tokens = {
				accessToken: 'new hashed accessToken',
				refreshToken: 'new hashed refreshToken',
			};
			jest.spyOn(service, 'generateTokens').mockResolvedValue(tokens);
			jest.spyOn(service, 'updateWhitelistedTokens').mockResolvedValue(null);

			service.refreshTokens('max.mustermann@gmx.de', 'refreshToken').then((result) => {
				expect(userService.findByEmail).toHaveBeenCalledWith('max.mustermann@gmx.de');
				expect(tokenWhitelist.findByUser).toHaveBeenCalledWith('1');
				expect(service.generateTokens).toHaveBeenCalledWith('1', 'max.mustermann@gmx.de');
				expect(service.updateWhitelistedTokens).toHaveBeenCalledWith({
					...tokens,
					userId: '1',
				});
				expect(result).toEqual({
					...tokens,
					user: {
						id: '1',
						email: 'max.mustermann@gmx.de',
					},
				});

				done();
			});
		});
	});

	describe('updateWhitelistedTokens(TokenPairAndOwner)', () => {
		it('should update whitelisted tokens', (done) => {
			jest.spyOn(tokenWhitelist, 'update').mockResolvedValue(null);
			jest
				.spyOn(cryptoService, 'hash')
				.mockReturnValueOnce('hashed refreshToken')
				.mockReturnValueOnce('hashed accessToken');

			service
				.updateWhitelistedTokens({
					refreshToken: 'refreshToken',
					accessToken: 'accessToken',
					userId: '1',
				})
				.then(() => {
					expect(tokenWhitelist.update).toHaveBeenCalledWith({
						userId: '1',
						accessToken: 'hashed accessToken',
						refreshToken: 'hashed refreshToken',
					});

					done();
				});
		});
	});

	it('should generate an access token and a refresh token', (done) => {
		jest
			.spyOn(jwtService, 'signAsync')
			.mockResolvedValueOnce('signed access token')
			.mockResolvedValue('signed refresh token');

		service.generateTokens('1', 'max.mustermann@gmx.de').then((result) => {
			expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
			expect(jwtService.signAsync).toHaveBeenNthCalledWith(
				1,
				{
					sub: '1',
					email: 'max.mustermann@gmx.de',
				},
				{
					expiresIn: '30m',
					secret: 'jwt access token secret',
				},
			);
			expect(jwtService.signAsync).toHaveBeenNthCalledWith(
				2,
				{
					sub: '1',
					email: 'max.mustermann@gmx.de',
				},
				{
					expiresIn: '7d',
					secret: 'jwt refresh token secret',
				},
			);
			expect(result).toEqual({
				accessToken: 'signed access token',
				refreshToken: 'signed refresh token',
			});

			done();
		});
	});
});
