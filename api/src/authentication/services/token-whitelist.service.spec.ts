const mockSHA256Hash = {
	toString: jest.fn(),
};

jest.mock('crypto-js', () => ({
	__esModule: true,
	SHA256: jest.fn().mockReturnValue(mockSHA256Hash),
	enc: {
		HEX: 1,
	},
}));

jest.mock('@Utils/current-timestamp-with-offset', () => ({
	__esModule: true,
	currentTimestampWithOffset: jest.fn(),
}));

import { Test } from '@nestjs/testing';

import { SHA256, enc } from 'crypto-js';
import { Repository } from 'typeorm';

import { TokenWhitelistService } from './token-whitelist.service';
import { TokenWhitelist } from '../entities';
import {
	provideTokenWhitelistRepository,
	TOKEN_WHITELIST_REPOSITORY_TOKEN,
} from '@Mocks/Providers/token-whitelist-repository.provider';
import { currentTimestampWithOffset } from '@Utils/current-timestamp-with-offset';

describe('Service: TokenWhitelistService', () => {
	let service: TokenWhitelistService;
	let repository: Repository<TokenWhitelist>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [TokenWhitelistService, provideTokenWhitelistRepository()],
		}).compile();

		repository = module.get(TOKEN_WHITELIST_REPOSITORY_TOKEN);
		service = module.get(TokenWhitelistService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('update(TokenPairAndOwner)', () => {
		beforeEach(() => {
			(currentTimestampWithOffset as jest.Mock)
				.mockReset()
				.mockReturnValueOnce('2024-01-01 12:30:00')
				.mockReturnValue('2024-01-08 12:00:00');
		});

		it('should update a non existing token whitelist entry', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue(null);
			jest.spyOn(repository, 'remove');
			const record = {
				save: jest.fn().mockResolvedValue(null),
			} as any;
			jest.spyOn(repository, 'create').mockReturnValue(record);

			service
				.update({
					accessToken: 'accessToken',
					refreshToken: 'refreshToken',
					userId: '1',
				})
				.then(() => {
					expect(service.findByUser).toHaveBeenCalledWith('1');
					expect(repository.remove).not.toHaveBeenCalled();
					expect(currentTimestampWithOffset).toHaveBeenCalledTimes(2);
					expect(currentTimestampWithOffset).toHaveBeenNthCalledWith(1, 30, 'minutes');
					expect(currentTimestampWithOffset).toHaveBeenNthCalledWith(2, 7, 'days');
					expect(repository.create).toHaveBeenCalledWith({
						user: {
							id: '1',
						},
						accessToken: 'accessToken',
						accessTokenExpirationDate: '2024-01-01 12:30:00',
						refreshToken: 'refreshToken',
						refreshTokenExpirationDate: '2024-01-08 12:00:00',
					});
					expect(record.save).toHaveBeenCalled();

					done();
				});
		});

		it('should update an existing token whitelist entry', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue('Token Whitelist Entry' as any);
			jest.spyOn(repository, 'remove').mockResolvedValue(null);
			const record = {
				save: jest.fn().mockResolvedValue(null),
			} as any;
			jest.spyOn(repository, 'create').mockReturnValue(record);

			service
				.update({
					accessToken: 'accessToken',
					refreshToken: 'refreshToken',
					userId: '1',
				})
				.then(() => {
					expect(service.findByUser).toHaveBeenCalledWith('1');
					expect(repository.remove).toHaveBeenCalledWith('Token Whitelist Entry');
					expect(currentTimestampWithOffset).toHaveBeenCalledTimes(2);
					expect(currentTimestampWithOffset).toHaveBeenNthCalledWith(1, 30, 'minutes');
					expect(currentTimestampWithOffset).toHaveBeenNthCalledWith(2, 7, 'days');
					expect(repository.create).toHaveBeenCalledWith({
						user: {
							id: '1',
						},
						accessToken: 'accessToken',
						accessTokenExpirationDate: '2024-01-01 12:30:00',
						refreshToken: 'refreshToken',
						refreshTokenExpirationDate: '2024-01-08 12:00:00',
					});
					expect(record.save).toHaveBeenCalled();

					done();
				});
		});
	});

	it('should delete a token whitelist entry by an users id', (done) => {
		jest.spyOn(repository, 'delete').mockResolvedValue({
			affected: 1,
			raw: '',
		});

		service.delete('1').then((result) => {
			expect(repository.delete).toHaveBeenCalledWith({
				user: {
					id: '1',
				},
			});
			expect(result).toEqual({
				affected: 1,
				raw: '',
			});

			done();
		});
	});

	it('should find a users token whitelist by their id', (done) => {
		jest.spyOn(repository, 'findOne').mockResolvedValue('Users TokenWhitelist' as any);

		service.findByUser('1').then((result) => {
			expect(repository.findOne).toHaveBeenCalledWith({
				where: {
					user: {
						id: '1',
					},
				},
			});
			expect(result).toEqual('Users TokenWhitelist');

			done();
		});
	});

	describe('verifyAccessToken(string, string)', () => {
		beforeEach(() => {
			mockSHA256Hash.toString.mockReturnValue('hashedAccessToken');
		});

		it('should verify the access token to be valid', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({
				accessToken: 'hashedAccessToken',
			} as any);

			service.verifyAccessToken('1', 'clearTextAccessToken').then((valid) => {
				expect(SHA256).toHaveBeenCalledWith('clearTextAccessToken');
				expect(mockSHA256Hash.toString).toHaveBeenCalledWith(enc.Hex);
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeTruthy();

				done();
			});
		});

		it('should verify the access token to be invalid', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({
				accessToken: 'differentHashedAccessToken',
			} as any);

			service.verifyAccessToken('1', 'clearTextAccessToken').then((valid) => {
				expect(SHA256).toHaveBeenCalledWith('clearTextAccessToken');
				expect(mockSHA256Hash.toString).toHaveBeenCalledWith(enc.Hex);
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeFalsy();

				done();
			});
		});

		it('should verify the access token to be invalid since the user could not be found', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue(null);

			service.verifyAccessToken('1', 'clearTextAccessToken').then((valid) => {
				expect(SHA256).toHaveBeenCalledWith('clearTextAccessToken');
				expect(mockSHA256Hash.toString).toHaveBeenCalledWith(enc.Hex);
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeFalsy();

				done();
			});
		});
	});

	describe('verifyRefreshToken(string, string)', () => {
		beforeEach(() => {
			mockSHA256Hash.toString.mockReturnValue('hashedRefreshToken');
		});

		it('should verify the refresh token to be valid', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({
				refreshToken: 'hashedRefreshToken',
			} as any);

			service.verifyRefreshToken('1', 'clearTextRefreshToken').then((valid) => {
				expect(SHA256).toHaveBeenCalledWith('clearTextRefreshToken');
				expect(mockSHA256Hash.toString).toHaveBeenCalledWith(enc.Hex);
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeTruthy();

				done();
			});
		});

		it('should verify the refresh token to be invalid', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({
				refreshToken: 'differentHashedRefreshToken',
			} as any);

			service.verifyRefreshToken('1', 'clearTextRefreshToken').then((valid) => {
				expect(SHA256).toHaveBeenCalledWith('clearTextRefreshToken');
				expect(mockSHA256Hash.toString).toHaveBeenCalledWith(enc.Hex);
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeFalsy();

				done();
			});
		});

		it('should verify the refresh token to be invalid since the user could not be found', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue(null);

			service.verifyRefreshToken('1', 'clearTextRefreshToken').then((valid) => {
				expect(SHA256).toHaveBeenCalledWith('clearTextRefreshToken');
				expect(mockSHA256Hash.toString).toHaveBeenCalledWith(enc.Hex);
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeFalsy();

				done();
			});
		});
	});
});
