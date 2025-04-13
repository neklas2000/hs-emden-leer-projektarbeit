import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { Repository } from 'typeorm';

import { User } from '@Entities/user';
import { BadRequestException } from '@Exceptions/bad-request.exception';
import { UserDoesNotExistException } from '@Exceptions/user-does-not-exist.exception';
import { CryptoService } from '@Services/crypto.service';
import { UserService } from '@Services/user.service';
import {
	USER_REPOSITORY_TOKEN,
	provideUserRepository,
} from '@Test/Providers/user-repository.provider';

describe('Service: UserService', () => {
	let service: UserService;
	let repository: Repository<User>;
	let crypto: CryptoService;
	let users: User[];

	beforeEach(async () => {
		users = [
			{
				id: '1',
				academicTitle: null,
				firstName: 'Max',
				lastName: 'Mustermann',
				email: 'max.mustermann@gmx.de',
				password: 'secure password',
				matriculationNumber: 1234567,
				phoneNumber: null,
				projects: [],
				tokenPair: {},
			},
			{
				id: '1',
				academicTitle: 'Prof. Dr.',
				firstName: 'Hubert',
				lastName: 'Mustermann',
				email: 'hubert.mustermann@gmail.de',
				password: 'different secure password',
				matriculationNumber: null,
				phoneNumber: '+49 1234 1234567890',
				projects: [],
				tokenPair: {},
			},
		] as any[];

		const module = await Test.createTestingModule({
			providers: [UserService, provideUserRepository(), CryptoService],
		}).compile();

		service = module.get(UserService);
		crypto = module.get(CryptoService);
		repository = module.get(USER_REPOSITORY_TOKEN);
	});

	it('should create', () => {
		expect(service).toBeTruthy();
	});

	describe('findAll(FindOptionsWhere<User>, FindOptionsSelect<User>, FindOptionsRelations<User>): Promise<User[]>', () => {
		it('should find all users', (done) => {
			jest.spyOn(repository, 'find').mockResolvedValue(users);

			service.findAll({}, {}, { projects: true, tokenPair: true }).then((result) => {
				expect(repository.find).toHaveBeenCalledWith({
					where: {},
					select: {},
					relations: {
						projects: true,
						tokenPair: true,
					},
				});
				expect(result).toEqual(users);

				done();
			});
		});
	});

	describe('searchAll(string): Promise<User[]>', () => {
		it("should find all users matching a name 'Mustermann'", (done) => {
			const where = jest.fn().mockReturnValue({
				getMany: jest.fn().mockResolvedValue(users),
			});
			jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
				select: jest.fn().mockReturnValue({
					where,
				}),
			} as any);

			service.searchAll('Mustermann').then((result) => {
				expect(repository.createQueryBuilder).toHaveBeenCalled();
				expect(where).toHaveBeenCalledWith(
					"LOWER(CONCAT(COALESCE(u.academic_title, ''), ' ', COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''))) LIKE :searchTerm",
					{
						searchTerm: '%mustermann%',
					},
				);
				expect(result).toEqual(users);

				done();
			});
		});
	});

	describe('findByEmail(string): Promise<Nullable<User>>', () => {
		it('should find a user by his email address', (done) => {
			jest.spyOn(repository, 'findOneBy').mockResolvedValue(users[0]);

			service.findByEmail('max.mustermann@gmx.de').then((result) => {
				expect(repository.findOneBy).toHaveBeenCalledWith({
					email: 'max.mustermann@gmx.de',
				});
				expect(result).toEqual(users[0]);

				done();
			});
		});
	});

	describe('findById(string): Promise<Nullable<User>>', () => {
		it('should find a user by his id', (done) => {
			jest.spyOn(repository, 'findOneBy').mockResolvedValue(users[1]);

			service.findById('2').then((result) => {
				expect(repository.findOneBy).toHaveBeenCalledWith({
					id: '2',
				});
				expect(result).toEqual(users[1]);

				done();
			});
		});
	});

	describe('findByIdAndCredentials(string, FindOptionsWhere<User>): Promise<Nullable<User>>', () => {
		it('should find an user without any where options', (done) => {
			jest.spyOn(repository, 'findOneBy').mockResolvedValue(users[0]);

			service.findByIdAndCredentials('1').then((result) => {
				expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
				expect(result).toEqual(users[0]);

				done();
			});
		});

		it('should find an user by his id and email address', (done) => {
			jest.spyOn(repository, 'findOneBy').mockResolvedValue(users[0]);

			service.findByIdAndCredentials('1', { email: 'max.mustermann@gmx.de' }).then((result) => {
				expect(repository.findOneBy).toHaveBeenCalledWith({
					id: '1',
					email: 'max.mustermann@gmx.de',
				});
				expect(result).toEqual(users[0]);

				done();
			});
		});

		it('should find an user by his id and password', (done) => {
			jest.spyOn(repository, 'findOneBy').mockResolvedValue(users[1]);
			jest.spyOn(crypto, 'hash').mockReturnValue('hashed password');

			service
				.findByIdAndCredentials('2', { password: 'different secure password' })
				.then((result) => {
					expect(repository.findOneBy).toHaveBeenCalledWith({
						id: '2',
						password: 'hashed password',
					});
					expect(result).toEqual(users[1]);

					done();
				});
		});
	});

	describe('register(DeepPartial<User>): Promise<User>', () => {
		it('should register a user', (done) => {
			const userPartial = { ...users[0] };
			delete userPartial.id;
			delete userPartial.projects;
			delete userPartial.tokenPair;
			const createdUser = {
				save: jest.fn().mockResolvedValue({
					...userPartial,
					id: '1',
				}),
			} as any;
			jest.spyOn(repository, 'create').mockReturnValue(createdUser);

			service.register(userPartial).then((result) => {
				expect(repository.create).toHaveBeenCalledWith(userPartial);
				expect(createdUser.save).toHaveBeenCalled();
				expect(result).toEqual({
					...userPartial,
					id: '1',
				});

				done();
			});
		});
	});

	describe('update(string, DeepPartial<User>): Promise<User>', () => {
		it('should try to update an user but should not find him', (done) => {
			jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

			service.update('3', {}).catch((exception) => {
				expect(repository.findOneBy).toHaveBeenCalledWith({ id: '3' });
				expect(exception).toBeInstanceOf(NotFoundException);

				done();
			});
		});

		it('should update the email address of an user', (done) => {
			const user = users[0];
			jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
			jest.spyOn(repository, 'save').mockResolvedValue(user);

			service.update('1', { email: 'max.mustermann@hotmail.com' }).then((result) => {
				expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
				expect(result).toEqual({
					...users[0],
					email: 'max.mustermann@hotmail.com',
				});

				done();
			});
		});

		it('should update the password of an user', (done) => {
			const user = users[0];
			jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
			jest.spyOn(crypto, 'hash').mockReturnValue('hashed password');
			jest.spyOn(repository, 'save').mockResolvedValue(user);

			service.update('1', { password: 'new very secure password' }).then((result) => {
				expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
				expect(result).toEqual({
					...users[0],
					password: 'hashed password',
				});

				done();
			});
		});
	});

	describe('delete(string): Promise<boolean>', () => {
		it('should throw an exception since the user does not exist', (done) => {
			jest.spyOn(service, 'findById').mockResolvedValue(null);

			service.delete('3').catch((exception) => {
				expect(exception).toBeInstanceOf(UserDoesNotExistException);

				done();
			});
		});

		it('should throw an exception due to an error while looking for the user', (done) => {
			const error = new Error('An error in your sql occurred');
			jest.spyOn(service, 'findById').mockRejectedValue(error);

			service.delete('1').catch((exception) => {
				expect(exception).toBeInstanceOf(BadRequestException);
				expect(exception.cause).toEqual(error);

				done();
			});
		});

		it('should successfully remove an user', (done) => {
			jest.spyOn(service, 'findById').mockResolvedValue({
				...users[0],
				remove: jest.fn().mockResolvedValue(true),
			} as any);

			service.delete('1').then((result) => {
				expect(result).toBe(true);

				done();
			});
		});
	});
});
