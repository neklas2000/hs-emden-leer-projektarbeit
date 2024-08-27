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

import { BadRequestException } from '@Exceptions/bad-request.exception';
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
	let users: UserService;
	let jwt: JwtService;
	let tokenWhitelist: TokenWhitelistService;
	let crypto: CryptoService;

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

		users = module.get(UserService);
		jwt = module.get(JwtService);
		tokenWhitelist = module.get(TokenWhitelistService);
		crypto = module.get(CryptoService);
		service = module.get(AuthenticationService);
	});

	it('should create', () => {
		expect(service).toBeTruthy();
	});

	describe('register(RegisterPayload): Promise<TokensWithUserResponse>', () => {
		it('should throw an exception since the user already exists', (done) => {
			jest.spyOn(users, 'findByEmail').mockResolvedValue({} as any);
			jest.spyOn(users, 'register');

			service
				.register({ email: 'max.mustermann@gmx.de', password: 'secure password' })
				.catch((exception) => {
					expect(users.register).not.toHaveBeenCalled();
					expect(exception).toBeInstanceOf(UserAlreadyExistsException);

					done();
				});
		});

		it('should register a new user and return the tokens', (done) => {
			jest.spyOn(users, 'findByEmail').mockResolvedValue(null);
			jest.spyOn(crypto, 'hash').mockReturnValueOnce('hashed secure password');
			jest.spyOn(users, 'register').mockResolvedValue({
				id: '1',
				email: 'max.mustermann@gmx.de',
				password: 'hashed secure password',
			} as any);
			jest
				.spyOn(jwt, 'signAsync')
				.mockResolvedValueOnce('accessToken')
				.mockResolvedValueOnce('refreshToken');
			jest.spyOn(tokenWhitelist, 'update').mockImplementation(() => Promise.resolve());

			service
				.register({ email: 'max.mustermann@gmx.de', password: 'secure password' })
				.then((result) => {
					expect(users.register).toHaveBeenCalled();
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

	describe('login(string, string): Promise<TokensWithUserResponse>', () => {
		it('should throw an exception since no user could be found', (done) => {
			jest.spyOn(users, 'findByEmail').mockResolvedValue(null);
			jest.spyOn(tokenWhitelist, 'update');

			service.login('max.mustermann@gmx.de', 'secure password').catch((exception) => {
				expect(tokenWhitelist.update).not.toHaveBeenCalled();
				expect(exception).toBeInstanceOf(IncorrectCredentialsException);

				done();
			});
		});

		it('should throw an exception since the passwords do not equal', (done) => {
			jest.spyOn(users, 'findByEmail').mockResolvedValue({
				password: 'different password',
			} as any);
			jest.spyOn(tokenWhitelist, 'update');

			service.login('max.mustermann@gmx.de', 'secure password').catch((exception) => {
				expect(tokenWhitelist.update).not.toHaveBeenCalled();
				expect(exception).toBeInstanceOf(IncorrectCredentialsException);

				done();
			});
		});

		it('should login the user and return the generated tokens', (done) => {
			jest.spyOn(users, 'findByEmail').mockResolvedValue({
				id: '1',
				email: 'max.mustermann@gmx.de',
				password: 'secure password',
			} as any);
			jest.spyOn(crypto, 'hash').mockReturnValueOnce('secure password');
			jest
				.spyOn(jwt, 'signAsync')
				.mockResolvedValueOnce('accessToken')
				.mockResolvedValueOnce('refreshToken');
			jest.spyOn(tokenWhitelist, 'update').mockResolvedValue(null);

			service.login('max.mustermann@gmx.de', 'secure password').then((result) => {
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

		it('should throw an exception while generating the tokens', (done) => {
			jest.spyOn(users, 'findByEmail').mockResolvedValue({
				id: '1',
				email: 'max.mustermann@gmx.de',
				password: 'secure password',
			} as any);
			jest.spyOn(crypto, 'hash').mockReturnValueOnce('secure password');
			const error = new Error('The value for the secret is invalid');
			jest.spyOn(jwt, 'signAsync').mockRejectedValueOnce(error);
			jest.spyOn(tokenWhitelist, 'update');

			service.login('max.mustermann@gmx.de', 'secure password').catch((exception) => {
				expect(tokenWhitelist.update).not.toHaveBeenCalled();
				expect(exception).toBeInstanceOf(BadRequestException);
				expect(exception).toHaveProperty('cause', error);

				done();
			});
		});
	});

	describe('logout(string): Promise<DeleteResult>', () => {
		it('should logout an user', (done) => {
			const expectedResponse = {
				affected: 1,
				raw: '',
			};
			jest.spyOn(tokenWhitelist, 'delete').mockResolvedValue(expectedResponse);

			service.logout('1').then((result) => {
				expect(result).toEqual(expectedResponse);

				done();
			});
		});
	});

	describe('refreshTokens(string, string): Promise<TokensWithUserResponse>', () => {
		it('should throw an exception since no user could be found', (done) => {
			jest.spyOn(users, 'findByEmail').mockResolvedValue(null);
			jest.spyOn(tokenWhitelist, 'update');

			service.refreshTokens('max.mustermann@gmx.de', 'refreshToken').catch((exception) => {
				expect(tokenWhitelist.update).not.toHaveBeenCalled();
				expect(exception).toBeInstanceOf(ForbiddenException);

				done();
			});
		});

		it('should throw an exception since no entry in the token whitelist could be found', (done) => {
			jest.spyOn(users, 'findByEmail').mockResolvedValue({
				id: '1',
				email: 'max.mustermann@gmx.de',
			} as any);
			jest.spyOn(tokenWhitelist, 'findByUser').mockResolvedValue(null);
			jest.spyOn(tokenWhitelist, 'update');

			service.refreshTokens('max.mustermann@gmx.de', 'refreshToken').catch((exception) => {
				expect(tokenWhitelist.update).not.toHaveBeenCalled();
				expect(exception).toBeInstanceOf(ForbiddenException);

				done();
			});
		});

		it('should throw an exception since the refresh tokens do not equal', (done) => {
			jest.spyOn(users, 'findByEmail').mockResolvedValue({
				id: '1',
				email: 'max.mustermann@gmx.de',
			} as any);
			jest.spyOn(tokenWhitelist, 'findByUser').mockResolvedValue({
				refreshToken: 'different hashed refreshToken',
			} as any);
			jest.spyOn(tokenWhitelist, 'update');

			service.refreshTokens('max.mustermann@gmx.de', 'refreshToken').catch((exception) => {
				expect(tokenWhitelist.update).not.toHaveBeenCalled();
				expect(exception).toBeInstanceOf(ForbiddenException);

				done();
			});
		});

		it('should refresh the token pair', (done) => {
			jest.spyOn(users, 'findByEmail').mockResolvedValue({
				id: '1',
				email: 'max.mustermann@gmx.de',
				password: 'secret password',
			} as any);
			jest.spyOn(tokenWhitelist, 'findByUser').mockResolvedValue({
				refreshToken: 'hashed refreshToken',
			} as any);
			jest.spyOn(crypto, 'hash').mockReturnValueOnce('hashed refreshToken');
			const tokens = {
				accessToken: 'new hashed accessToken',
				refreshToken: 'new hashed refreshToken',
			};
			jest
				.spyOn(jwt, 'signAsync')
				.mockResolvedValueOnce(tokens.accessToken)
				.mockResolvedValueOnce(tokens.refreshToken);
			jest.spyOn(tokenWhitelist, 'update').mockResolvedValue(null);

			service.refreshTokens('max.mustermann@gmx.de', 'refreshToken').then((result) => {
				expect(tokenWhitelist.update).toHaveBeenCalled();
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
