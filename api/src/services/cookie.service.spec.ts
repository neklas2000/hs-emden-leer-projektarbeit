jest.mock('@Environment', () => ({
	__esModule: true,
	default: {
		ACCESS_TOKEN_EXPIRATION: '30m',
		REFRESH_TOKEN_EXPIRATION: '7d',
	},
}));

import { Test, TestingModule } from '@nestjs/testing';

import { DateTime } from 'luxon';

import { CookieService } from '@Services/cookie.service';
import { DateService } from '@Services/date.service';

describe('Service: CookieService', () => {
	let service: CookieService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CookieService, DateService],
		}).compile();

		service = module.get(CookieService);
	});

	it('should create', () => {
		expect(service).toBeTruthy();
	});

	describe('set(TokensWithUserResponse, Response): void', () => {
		it('should set the accessToken and refreshToken cookies', () => {
			jest.useFakeTimers();
			jest.setSystemTime(
				DateTime.fromFormat('2024-01-01 06:00:00', 'yyyy-MM-dd HH:mm:ss').toJSDate(),
			);
			jest.resetModules();
			const accessTokenExpires = DateTime.fromFormat(
				'2024-01-01 06:30:00',
				'yyyy-MM-dd HH:mm:ss',
			).toJSDate();
			const refreshTokenExpires = DateTime.fromFormat(
				'2024-01-08 06:00:00',
				'yyyy-MM-dd HH:mm:ss',
			).toJSDate();

			const response = {
				cookie: jest.fn(),
			} as any;

			service.set(
				{
					accessToken: 'access token',
					refreshToken: 'refresh token',
					user: { id: '1' },
				},
				response,
			);

			expect(response.cookie.mock.calls.length).toBe(2);
			expect(response.cookie.mock.calls[0][1]).toEqual('access token');
			expect(response.cookie.mock.calls[1][1]).toEqual('refresh token');
			expect(response.cookie.mock.calls[0][2]).toHaveProperty('expires', accessTokenExpires);
			expect(response.cookie.mock.calls[1][2]).toHaveProperty('expires', refreshTokenExpires);

			jest.useRealTimers();
		});
	});

	describe('clear(Response): void', () => {
		it('should clear the cookies', () => {
			const response = {
				clearCookie: jest.fn(),
			} as any;

			service.clear(response);

			expect(response.clearCookie).toHaveBeenCalledTimes(2);
		});
	});
});
