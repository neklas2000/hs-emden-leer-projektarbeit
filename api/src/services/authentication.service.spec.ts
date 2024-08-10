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

import { IncorrectCredentialsException } from '@Exceptions/incorrect-credentials.exception';
import { UserAlreadyExistsException } from '@Exceptions/user-already-exists.exception';
import { AuthenticationService } from '@Services/authentication.service';
import { CryptoService } from '@Services/crypto.service';
import { DateService } from '@Services/date.service';
import { TokenWhitelistService } from '@Services/token-whitelist.service';
import { UserService } from '@Services/user.service';
import { provideTokenWhitelistRepository } from '@Test/Providers/token-whitelist-repository.provider';
import { provideUserRepository } from '@Test/Providers/user-repository.provider';

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
			jest
				.spyOn(jwtService, 'signAsync')
				.mockResolvedValueOnce('accessToken')
				.mockResolvedValueOnce('refreshToken');
			jest.spyOn(tokenWhitelist, 'update').mockImplementation(() => Promise.resolve());

			service
				.register({ email: 'max.mustermann@gmx.de', password: 'secure password' })
				.then((result) => {
					expect(userService.findByEmail).toHaveBeenCalledTimes(1);
					expect(userService.register).toHaveBeenCalledTimes(1);
					expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
					expect(tokenWhitelist.update).toHaveBeenCalledTimes(1);
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
			jest.spyOn(jwtService, 'signAsync');

			service.login('max.mustermann@gmx.de', 'secure password').catch((exception) => {
				expect(userService.findByEmail).toHaveBeenCalledWith('max.mustermann@gmx.de');
				expect(jwtService.signAsync).not.toHaveBeenCalled();
				expect(exception).toBeInstanceOf(IncorrectCredentialsException);

				done();
			});
		});

		it('should throw an exception since the passwords do not equal', (done) => {
			jest.spyOn(userService, 'findByEmail').mockResolvedValue({
				password: 'different password',
			} as any);
			jest.spyOn(jwtService, 'signAsync');

			service.login('max.mustermann@gmx.de', 'secure password').catch((exception) => {
				expect(userService.findByEmail).toHaveBeenCalledWith('max.mustermann@gmx.de');
				expect(jwtService.signAsync).not.toHaveBeenCalled();
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
			jest
				.spyOn(jwtService, 'signAsync')
				.mockResolvedValueOnce('accessToken')
				.mockResolvedValueOnce('refreshToken');
			jest.spyOn(tokenWhitelist, 'update').mockResolvedValue(null);

			service.login('max.mustermann@gmx.de', 'secure password').then((result) => {
				expect(userService.findByEmail).toHaveBeenCalledWith('max.mustermann@gmx.de');
				expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
				expect(tokenWhitelist.update).toHaveBeenCalledTimes(1);
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
			jest.spyOn(jwtService, 'signAsync');

			service.refreshTokens('max.mustermann@gmx.de', 'refreshToken').catch((exception) => {
				expect(userService.findByEmail).toHaveBeenCalledWith('max.mustermann@gmx.de');
				expect(tokenWhitelist.findByUser).toHaveBeenCalledWith('1');
				expect(jwtService.signAsync).not.toHaveBeenCalled();
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
			jest
				.spyOn(jwtService, 'signAsync')
				.mockResolvedValueOnce(tokens.accessToken)
				.mockResolvedValueOnce(tokens.refreshToken);
			jest.spyOn(tokenWhitelist, 'update').mockResolvedValue(null);

			service.refreshTokens('max.mustermann@gmx.de', 'refreshToken').then((result) => {
				expect(userService.findByEmail).toHaveBeenCalledWith('max.mustermann@gmx.de');
				expect(tokenWhitelist.findByUser).toHaveBeenCalledWith('1');
				expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
				expect(tokenWhitelist.update).toHaveBeenCalledTimes(1);
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
});
