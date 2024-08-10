jest.mock('@Environment', () => ({
	__esModule: true,
	default: {
		ACCESS_TOKEN_EXPIRATION: '30m',
		REFRESH_TOKEN_EXPIRATION: '7d',
	},
}));

import { Test } from '@nestjs/testing';

import { Repository } from 'typeorm';

import { TokenWhitelist } from '@Entities/token-whitelist';
import { CryptoService } from '@Services/crypto.service';
import { DateService } from '@Services/date.service';
import { TokenWhitelistService } from '@Services/token-whitelist.service';
import {
	provideTokenWhitelistRepository,
	TOKEN_WHITELIST_REPOSITORY_TOKEN,
} from '@Test/Providers/token-whitelist-repository.provider';

describe('Service: TokenWhitelistService', () => {
	let service: TokenWhitelistService;
	let repository: Repository<TokenWhitelist>;
	let dateService: DateService;
	let cryptoService: CryptoService;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				TokenWhitelistService,
				provideTokenWhitelistRepository(),
				DateService,
				CryptoService,
			],
		}).compile();

		repository = module.get(TOKEN_WHITELIST_REPOSITORY_TOKEN);
		dateService = module.get(DateService);
		cryptoService = module.get(CryptoService);
		service = module.get(TokenWhitelistService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('update(TokenPairAndOwner)', () => {
		it('should update a non existing token whitelist entry', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue(null);
			jest.spyOn(repository, 'remove');
			jest
				.spyOn(dateService, 'getCurrentTimestampWithOffset')
				.mockReturnValueOnce('2024-01-01 12:30:00')
				.mockReturnValueOnce('2024-01-08 12:00:00');
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
			jest
				.spyOn(dateService, 'getCurrentTimestampWithOffset')
				.mockReturnValueOnce('2024-01-01 12:30:00')
				.mockReturnValueOnce('2024-01-08 12:00:00');

			service
				.update({
					accessToken: 'accessToken',
					refreshToken: 'refreshToken',
					userId: '1',
				})
				.then(() => {
					expect(service.findByUser).toHaveBeenCalledWith('1');
					expect(repository.remove).toHaveBeenCalledWith('Token Whitelist Entry');
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
		it('should verify the access token to be valid', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({
				accessToken: 'hashedAccessToken',
				accessTokenExpirationDate: '',
			} as any);
			jest.spyOn(dateService, 'isAfterCurrentTimestamp').mockReturnValue(true);
			jest.spyOn(cryptoService, 'hash').mockReturnValueOnce('hashedAccessToken');

			service.verifyAccessToken('1', 'clearTextAccessToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeTruthy();

				done();
			});
		});

		it('should verify the access token to be invalid since the hashes do not equal', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({
				accessToken: 'differentHashedAccessToken',
			} as any);
			jest.spyOn(dateService, 'isAfterCurrentTimestamp').mockReturnValue(true);
			jest.spyOn(cryptoService, 'hash').mockReturnValueOnce('hashedAccessToken');

			service.verifyAccessToken('1', 'clearTextAccessToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeFalsy();

				done();
			});
		});

		it('should verify the access token to be invalid since the user could not be found', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue(null);
			jest.spyOn(dateService, 'isAfterCurrentTimestamp');

			service.verifyAccessToken('1', 'clearTextAccessToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(dateService.isAfterCurrentTimestamp).not.toHaveBeenCalled();
				expect(valid).toBeFalsy();

				done();
			});
		});
	});

	describe('verifyRefreshToken(string, string)', () => {
		it('should verify the refresh token to be valid', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({
				refreshToken: 'hashedRefreshToken',
			} as any);
			jest.spyOn(dateService, 'isAfterCurrentTimestamp').mockReturnValue(true);
			jest.spyOn(cryptoService, 'hash').mockReturnValueOnce('hashedRefreshToken');

			service.verifyRefreshToken('1', 'clearTextRefreshToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeTruthy();

				done();
			});
		});

		it('should verify the refresh token to be invalid since the hashes do not equal', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({
				refreshToken: 'differentHashedRefreshToken',
			} as any);
			jest.spyOn(dateService, 'isAfterCurrentTimestamp').mockReturnValue(true);
			jest.spyOn(cryptoService, 'hash').mockReturnValueOnce('hashedRefreshToken');

			service.verifyRefreshToken('1', 'clearTextRefreshToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeFalsy();

				done();
			});
		});

		it('should verify the refresh token to be invalid since the user could not be found', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue(null);
			jest.spyOn(dateService, 'isAfterCurrentTimestamp');

			service.verifyRefreshToken('1', 'clearTextRefreshToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(dateService.isAfterCurrentTimestamp).not.toHaveBeenCalled();
				expect(valid).toBeFalsy();

				done();
			});
		});
	});
});
