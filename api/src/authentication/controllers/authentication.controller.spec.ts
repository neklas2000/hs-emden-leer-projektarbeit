jest.mock('@Environment', () => ({
	__esModule: true,
	default: {
		ACCESS_TOKEN_EXPIRATION: '30m',
		REFRESH_TOKEN_EXPIRATION: '7d',
	},
}));

import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { AuthenticationController } from './authentication.controller';
import { provideUserRepository } from '@Mocks/Providers/user-repository.provider';
import { provideTokenWhitelistRepository } from '@Mocks/Providers/token-whitelist-repository.provider';
import { UserService } from '@Routes/User/services';
import { AuthenticationService, TokenWhitelistService } from '../services';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@Tokens/index';
import { DateService } from '@Services/date.service';
import { CryptoService } from '@Services/crypto.service';

describe('Controller: AuthenticationController', () => {
	let controller: AuthenticationController;
	let authenticationService: AuthenticationService;
	let dateService: DateService;

	beforeEach(async () => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2024-01-01T06:00:00'));

		const module = await Test.createTestingModule({
			providers: [
				AuthenticationService,
				UserService,
				provideUserRepository(),
				JwtService,
				TokenWhitelistService,
				provideTokenWhitelistRepository(),
				DateService,
				CryptoService,
			],
			controllers: [AuthenticationController],
		}).compile();

		authenticationService = module.get(AuthenticationService);
		dateService = module.get(DateService);
		controller = module.get(AuthenticationController);
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should be created', () => {
		expect(authenticationService).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	it('should register a user', (done) => {
		jest.spyOn(authenticationService, 'register').mockResolvedValue({
			accessToken: 'accessToken',
			refreshToken: 'refreshToken',
			user: {
				id: '1',
				email: 'max.mustermann@gmx.de',
				password: 'secure password',
			},
		});

		controller
			.register({
				email: 'max.mustermann@gmx.de',
				password: 'secure password',
			})
			.pipe(take(1))
			.subscribe((result) => {
				expect(authenticationService.register).toHaveBeenCalledWith({
					email: 'max.mustermann@gmx.de',
					password: 'secure password',
				});
				expect(result).toEqual({
					accessToken: 'accessToken',
					refreshToken: 'refreshToken',
					user: {
						id: '1',
						email: 'max.mustermann@gmx.de',
						password: 'secure password',
					},
				});

				done();
			});
	});

	it('should sign a user in and set cookies', (done) => {
		const res = {
			cookie: jest.fn(),
		} as any;
		jest.spyOn(authenticationService, 'login').mockResolvedValue({
			accessToken: 'accessToken',
			refreshToken: 'refreshToken',
			user: {
				id: '1',
				email: 'max.mustermann@gmx.de',
				password: 'secure password',
			},
		});

		controller
			.login(
				{
					email: 'max.mustermann@gmx.de',
					password: 'secure password',
				},
				res,
			)
			.pipe(take(1))
			.subscribe((result) => {
				expect(authenticationService.login).toHaveBeenCalledWith(
					'max.mustermann@gmx.de',
					'secure password',
				);
				expect(res.cookie).toHaveBeenCalledTimes(2);
				expect(res.cookie).toHaveBeenNthCalledWith(1, ACCESS_TOKEN_COOKIE, 'accessToken', {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					expires: new Date('2024-01-01T06:30:00'),
				});
				expect(res.cookie).toHaveBeenNthCalledWith(2, REFRESH_TOKEN_COOKIE, 'refreshToken', {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					expires: new Date('2024-01-08T06:00:00'),
				});
				expect(result).toEqual({
					accessToken: 'accessToken',
					refreshToken: 'refreshToken',
					user: {
						id: '1',
						email: 'max.mustermann@gmx.de',
						password: 'secure password',
					},
				});

				done();
			});
	});

	describe('logout(Express.User, Response)', () => {
		it('should successfully logout the user', (done) => {
			const res = {
				clearCookie: jest.fn(),
			} as any;
			jest.spyOn(authenticationService, 'logout').mockResolvedValue({ affected: 1, raw: '' });

			controller
				.logout(
					{
						sub: '1',
					},
					res,
				)
				.pipe(take(1))
				.subscribe((result) => {
					expect(authenticationService.logout).toHaveBeenCalledWith('1');
					expect(res.clearCookie).toHaveBeenCalledTimes(2);
					expect(res.clearCookie).toHaveBeenNthCalledWith(1, ACCESS_TOKEN_COOKIE);
					expect(res.clearCookie).toHaveBeenNthCalledWith(2, REFRESH_TOKEN_COOKIE);
					expect(result).toEqual({ success: true });

					done();
				});
		});

		it('should fail to logout the user', (done) => {
			const res = {
				clearCookie: jest.fn(),
			} as any;
			jest.spyOn(authenticationService, 'logout').mockResolvedValue({} as any);

			controller
				.logout(
					{
						sub: '1',
					},
					res,
				)
				.pipe(take(1))
				.subscribe((result) => {
					expect(authenticationService.logout).toHaveBeenCalledWith('1');
					expect(res.clearCookie).not.toHaveBeenCalled();
					expect(result).toEqual({ success: false });

					done();
				});
		});
	});

	it('should refresh the tokens and update the cookies', (done) => {
		const res = {
			cookie: jest.fn(),
		} as any;
		jest.spyOn(authenticationService, 'refreshTokens').mockResolvedValue({
			accessToken: 'accessToken',
			refreshToken: 'refreshToken',
		});
		const accessTokenExpiration = new Date('2024-01-01T06:30:00');
		const refreshTokenExpiration = new Date('2024-01-08T06:00:00');
		jest
			.spyOn(dateService, 'getExpirationDateWithOffset')
			.mockReturnValueOnce(accessTokenExpiration)
			.mockReturnValueOnce(refreshTokenExpiration);

		controller
			.refreshTokens(
				{
					email: 'max.mustermann@gmx.de',
					refreshToken: 'old refreshToken',
				},
				res,
			)
			.pipe(take(1))
			.subscribe((result) => {
				expect(authenticationService.refreshTokens).toHaveBeenCalledWith(
					'max.mustermann@gmx.de',
					'old refreshToken',
				);
				expect(res.cookie).toHaveBeenCalledTimes(2);
				expect(res.cookie).toHaveBeenNthCalledWith(1, ACCESS_TOKEN_COOKIE, 'accessToken', {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					expires: accessTokenExpiration,
				});
				expect(res.cookie).toHaveBeenNthCalledWith(2, REFRESH_TOKEN_COOKIE, 'refreshToken', {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					expires: refreshTokenExpiration,
				});
				expect(result).toEqual({
					accessToken: 'accessToken',
					refreshToken: 'refreshToken',
				});

				done();
			});
	});
});
