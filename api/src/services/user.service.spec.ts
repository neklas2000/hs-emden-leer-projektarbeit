import { Test } from '@nestjs/testing';

import { Repository } from 'typeorm';

import { User } from '@Entities/user';
import { CryptoService } from '@Services/crypto.service';
import { UserService } from '@Services/user.service';
import {
	USER_REPOSITORY_TOKEN,
	provideUserRepository,
} from '@Test/Providers/user-repository.provider';

describe('Service: UserService', () => {
	let service: UserService;
	let repository: Repository<User>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [UserService, provideUserRepository(), CryptoService],
		}).compile();

		service = module.get(UserService);
		repository = module.get(USER_REPOSITORY_TOKEN);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should find all users', (done) => {
		jest.spyOn(repository, 'find').mockResolvedValue(['user 1', 'user 2'] as any[]);

		service.findAll({}, {}, {}).then((result) => {
			expect(repository.find).toHaveBeenCalledWith({
				where: {},
				select: {},
				relations: {},
			});
			expect(result).toEqual(['user 1', 'user 2']);

			done();
		});
	});

	it('should find a user by his email address', (done) => {
		jest.spyOn(repository, 'findOneBy').mockResolvedValue('User' as any);

		service.findByEmail('max.mustermann@gmx.de').then((result) => {
			expect(repository.findOneBy).toHaveBeenCalledWith({
				email: 'max.mustermann@gmx.de',
			});
			expect(result).toEqual('User');

			done();
		});
	});

	it('should register a user', (done) => {
		const user = {
			save: jest.fn().mockResolvedValue('User'),
		};
		jest.spyOn(repository, 'create').mockReturnValue(user as any);

		service
			.register({ email: 'max.mustermann@gmx.de', password: 'securePassword' })
			.then((result) => {
				expect(repository.create).toHaveBeenCalledWith({
					email: 'max.mustermann@gmx.de',
					password: 'securePassword',
				});
				expect(user.save).toHaveBeenCalled();
				expect(result).toEqual('User');

				done();
			});
	});
});
