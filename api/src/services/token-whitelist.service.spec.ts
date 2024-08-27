jest.mock('@Environment', () => ({
	__esModule: true,
	default: {
		ACCESS_TOKEN_EXPIRATION: '30m',
		REFRESH_TOKEN_EXPIRATION: '7d',
	},
}));

import { Test } from '@nestjs/testing';

import { DateTime } from 'luxon';
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
	let crypto: CryptoService;

	beforeAll(() => {
		jest.useFakeTimers();
		jest.setSystemTime(
			DateTime.fromFormat('2024-01-01 12:00:00', 'yyyy-MM-dd HH:mm:ss').toJSDate(),
		);
		jest.resetModules();
	});

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
		crypto = module.get(CryptoService);
		service = module.get(TokenWhitelistService);
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it('should create', () => {
		expect(service).toBeTruthy();
	});

	describe('update(TokenPairAndOwner): Promise<void>', () => {
		const accessTokenExpirationDate = '2024-01-01 12:30:00';
		const refreshTokenExpirationDate = '2024-01-08 12:00:00';

		it('should update a non existing token whitelist entry', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue(null);
			jest.spyOn(repository, 'remove');
			jest.spyOn(repository, 'create').mockReturnValue({
				save: jest.fn().mockResolvedValue(true),
			} as never);

			service
				.update({
					accessToken: 'new accessToken',
					refreshToken: 'new refreshToken',
					userId: '1',
				})
				.then(() => {
					expect(service.findByUser).toHaveBeenCalledWith('1');
					expect(repository.remove).not.toHaveBeenCalled();
					expect(repository.create).toHaveBeenCalledWith({
						user: {
							id: '1',
						},
						accessToken: 'new accessToken',
						accessTokenExpirationDate,
						refreshToken: 'new refreshToken',
						refreshTokenExpirationDate,
					});

					done();
				});
		});

		it('should update an existing token whitelist entry and remove the existing one first', (done) => {
			const entry = {
				accessToken: 'old accessToken',
				refreshToken: 'old refreshToken',
			} as any;
			jest.spyOn(service, 'findByUser').mockResolvedValue(entry);
			jest.spyOn(repository, 'remove').mockResolvedValue(null);
			jest.spyOn(repository, 'create').mockReturnValue({
				save: jest.fn().mockResolvedValue(true),
			} as never);

			service
				.update({
					accessToken: 'new accessToken',
					refreshToken: 'new refreshToken',
					userId: '1',
				})
				.then(() => {
					expect(service.findByUser).toHaveBeenCalledWith('1');
					expect(repository.remove).toHaveBeenCalledWith(entry);
					expect(repository.create).toHaveBeenCalledWith({
						user: {
							id: '1',
						},
						accessToken: 'new accessToken',
						accessTokenExpirationDate,
						refreshToken: 'new refreshToken',
						refreshTokenExpirationDate,
					});

					done();
				});
		});
	});

	describe('delete(string): Promise<DeleteResult>', () => {
		it('should delete a token whitelist entry by an users id', (done) => {
			const deleteResult = {
				affected: 1,
				raw: '',
			};
			jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

			service.delete('1').then((result) => {
				expect(repository.delete).toHaveBeenCalledWith({
					user: {
						id: '1',
					},
				});
				expect(result).toEqual(deleteResult);

				done();
			});
		});
	});

	describe('findByUser(string): Promise<TokenWhitelist>', () => {
		it('should find a users token whitelist by their id', (done) => {
			const entry = {
				accessToken: 'stored accessToken',
				refreshToken: 'stored refreshToken',
			} as any;
			jest.spyOn(repository, 'findOne').mockResolvedValue(entry);

			service.findByUser('1').then((result) => {
				expect(repository.findOne).toHaveBeenCalledWith({
					where: {
						user: {
							id: '1',
						},
					},
				});
				expect(result).toEqual(entry);

				done();
			});
		});
	});

	describe('verifyAccessToken(string, string): Promise<boolean>', () => {
		it('should verify the access token to be invalid since the user could not be found', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue(null);

			service.verifyAccessToken('1', 'clear text accessToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeFalsy();

				done();
			});
		});

		it('should verify the access token to be invalid, since the stored access token is null', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({ accessToken: null } as any);

			service.verifyAccessToken('1', 'clear text accessToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeFalsy();

				done();
			});
		});

		it('should verify the access token to be invalid, since the stored expiration date is before the current time', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({
				accessToken: 'hashed accessToken',
				accessTokenExpirationDate: '2024-01-01 11:59:59',
			} as any);

			service.verifyAccessToken('1', 'clear text accessToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeFalsy();

				done();
			});
		});

		it('should verify the access token to be invalid since the hashes do not equal', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({
				accessToken: 'different hashed accessToken',
				accessTokenExpirationDate: '2024-01-01 12:00:01',
			} as any);
			jest.spyOn(crypto, 'hash').mockReturnValueOnce('hashed accessToken');

			service.verifyAccessToken('1', 'clear text accessToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeFalsy();

				done();
			});
		});

		it('should verify the access token to be valid', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({
				accessToken: 'hashed accessToken',
				accessTokenExpirationDate: '2024-01-01 12:24:42',
			} as any);
			jest.spyOn(crypto, 'hash').mockReturnValueOnce('hashed accessToken');

			service.verifyAccessToken('1', 'clear text accessToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeTruthy();

				done();
			});
		});
	});

	describe('verifyRefreshToken(string, string): Promise<boolean>', () => {
		it('should verify the refresh token to be invalid since the user could not be found', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue(null);

			service.verifyRefreshToken('1', 'clear text refreshToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeFalsy();

				done();
			});
		});

		it('should verify the refresh token to be invalid, since the stored refresh token is null', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({ refreshToken: null } as any);

			service.verifyRefreshToken('1', 'clear text refreshToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeFalsy();

				done();
			});
		});

		it('should verify the refresh token to be invalid, since the stored expiration date is before the current time', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({
				refreshToken: 'hashed refreshToken',
				refreshTokenExpirationDate: '2024-01-01 11:59:59',
			} as any);

			service.verifyRefreshToken('1', 'clear text refreshToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeFalsy();

				done();
			});
		});

		it('should verify the refresh token to be invalid since the hashes do not equal', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({
				refreshToken: 'different hashed refreshToken',
				refreshTokenExpirationDate: '2024-01-01 12:00:01',
			} as any);
			jest.spyOn(crypto, 'hash').mockReturnValueOnce('hashed refreshToken');

			service.verifyRefreshToken('1', 'clear text refreshToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeFalsy();

				done();
			});
		});

		it('should verify the refresh token to be valid', (done) => {
			jest.spyOn(service, 'findByUser').mockResolvedValue({
				refreshToken: 'hashed refreshToken',
				refreshTokenExpirationDate: '2024-01-01 12:24:42',
			} as any);
			jest.spyOn(crypto, 'hash').mockReturnValueOnce('hashed refreshToken');

			service.verifyRefreshToken('1', 'clear text refreshToken').then((valid) => {
				expect(service.findByUser).toHaveBeenCalledWith('1');
				expect(valid).toBeTruthy();

				done();
			});
		});
	});
});
