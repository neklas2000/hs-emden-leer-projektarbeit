import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { Response } from 'express';
import { take } from 'rxjs';

import { AuthenticationController } from '@Controllers/authentication.controller';
import { AuthenticationService } from '@Services/authentication.service';
import { CookieService } from '@Services/cookie.service';
import { CryptoService } from '@Services/crypto.service';
import { DateService } from '@Services/date.service';
import { TokenWhitelistService } from '@Services/token-whitelist.service';
import { UserService } from '@Services/user.service';
import { provideTokenWhitelistRepository } from '@Test/Providers/token-whitelist-repository.provider';
import { provideUserRepository } from '@Test/Providers/user-repository.provider';

describe('Controller: AuthenticationController', () => {
	let controller: AuthenticationController;
	let authentication: AuthenticationService;
	let cookies: CookieService;
	let response: Response;
	const expectedTokensWithUserResult = {
		accessToken: 'accessToken',
		refreshToken: 'refreshToken',
		user: {
			id: '1',
			email: 'max.mustermann@gmx.de',
		},
	};

	beforeEach(async () => {
		response = {
			cookie: jest.fn(),
			clearCookie: jest.fn(),
		} as any as Response;

		const module = await Test.createTestingModule({
			providers: [
				AuthenticationService,
				UserService,
				provideUserRepository(),
				JwtService,
				TokenWhitelistService,
				provideTokenWhitelistRepository(),
				CookieService,
				DateService,
				CryptoService,
			],
			controllers: [AuthenticationController],
		}).compile();

		authentication = module.get(AuthenticationService);
		cookies = module.get(CookieService);
		controller = module.get(AuthenticationController);
	});

	it('should create', () => {
		expect(authentication).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	describe('register(RegisterPayload, Response): Observable<TokensWithUserRespones>', () => {
		it('should register an user and set the cookies', (done) => {
			jest.spyOn(authentication, 'register').mockResolvedValue(expectedTokensWithUserResult);
			jest.spyOn(cookies, 'set').mockImplementation();

			controller
				.register(
					{
						email: 'max.mustermann@gmx.de',
						password: 'secure password',
					},
					response,
				)
				.pipe(take(1))
				.subscribe((result) => {
					expect(cookies.set).toHaveBeenCalledWith(expectedTokensWithUserResult, response);
					expect(result).toEqual(expectedTokensWithUserResult);

					done();
				});
		});
	});

	describe('login(AuthenticationPayload, Response): Observable<TokensWithUserRespones>', () => {
		it('should login an user and set the cookies', (done) => {
			jest.spyOn(authentication, 'login').mockResolvedValue(expectedTokensWithUserResult);
			jest.spyOn(cookies, 'set').mockImplementation();

			controller
				.login({ email: 'max.mustermann@gmx.de', password: 'very secure password' }, response)
				.pipe(take(1))
				.subscribe((result) => {
					expect(cookies.set).toHaveBeenCalledWith(expectedTokensWithUserResult, response);
					expect(result).toEqual(expectedTokensWithUserResult);

					done();
				});
		});
	});

	describe('logout(Express.User, Response): Observable<LogoutResult>', () => {
		it('should logout an user and clear his cookies', (done) => {
			jest.spyOn(authentication, 'logout').mockResolvedValue({ affected: 1 } as any);
			jest.spyOn(cookies, 'clear').mockImplementation();

			controller
				.logout({ sub: '1' }, response)
				.pipe(take(1))
				.subscribe((result) => {
					expect(authentication.logout).toHaveBeenCalledWith('1');
					expect(cookies.clear).toHaveBeenCalled();
					expect(result).toEqual({ success: true });

					done();
				});
		});

		it('should logout an user but fail to confirm it and not clear his cookies', (done) => {
			jest.spyOn(authentication, 'logout').mockResolvedValue(null);
			jest.spyOn(cookies, 'clear').mockImplementation();

			controller
				.logout({ sub: '1' }, response)
				.pipe(take(1))
				.subscribe((result) => {
					expect(authentication.logout).toHaveBeenCalledWith('1');
					expect(cookies.clear).not.toHaveBeenCalled();
					expect(result).toEqual({ success: false });

					done();
				});
		});
	});

	describe('refreshTokens(Express.User, Response): Observable<TokensWithUserResponse>', () => {
		it('should refresh the tokens and set the cookies with the new tokens', (done) => {
			jest.spyOn(authentication, 'refreshTokens').mockResolvedValue(expectedTokensWithUserResult);
			jest.spyOn(cookies, 'set').mockImplementation();

			controller
				.refreshTokens(
					{
						email: 'max.mustermann@gmx.de',
						refreshToken: 'old refresh token',
					},
					response,
				)
				.pipe(take(1))
				.subscribe((result) => {
					expect(authentication.refreshTokens).toHaveBeenCalledWith(
						'max.mustermann@gmx.de',
						'old refresh token',
					);
					expect(cookies.set).toHaveBeenCalled();
					expect(result).toEqual(expectedTokensWithUserResult);

					done();
				});
		});
	});
});
