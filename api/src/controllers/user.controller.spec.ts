import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { UserController } from '@Controllers/user.controller';
import { User } from '@Entities/user';
import { CryptoService } from '@Services/crypto.service';
import { UserService } from '@Services/user.service';
import { provideUserRepository } from '@Test/Providers/user-repository.provider';

describe('Controller: UserController', () => {
	let controller: UserController;
	let users: UserService;
	let storedUsers: User[];

	beforeEach(async () => {
		storedUsers = [
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
			controllers: [UserController],
		}).compile();

		users = module.get(UserService);
		controller = module.get(UserController);
	});

	it('should create', () => {
		expect(users).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	describe('findAll(FindOptionsWhere<User>, FindOptionsSelect<User>, FindOptionsRelations<User>): Observable<User[]>', () => {
		it('should find all users and return them', (done) => {
			jest.spyOn(users, 'findAll').mockResolvedValue(storedUsers);

			controller
				.findAll({}, {}, { projects: true, tokenPair: true })
				.pipe(take(1))
				.subscribe((result) => {
					expect(users.findAll).toHaveBeenCalledWith({}, {}, { projects: true, tokenPair: true });
					expect(result).toEqual(storedUsers);

					done();
				});
		});
	});

	describe('searchAll(SearchBody): Observable<User[]>', () => {
		it('should query all users and return all who match the query', (done) => {
			const resolvedUsers = [...storedUsers];

			for (const resolvedUser of resolvedUsers) {
				delete resolvedUser.email;
				delete resolvedUser.password;
				delete resolvedUser.phoneNumber;
			}

			jest.spyOn(users, 'searchAll').mockResolvedValue(storedUsers);

			controller
				.searchAll({ searchTerm: 'Mustermann' })
				.pipe(take(1))
				.subscribe((result) => {
					expect(users.searchAll).toHaveBeenCalledWith('Mustermann');
					expect(result).toEqual(resolvedUsers);

					done();
				});
		});
	});

	describe('deleteOne(Express.User): Observable<Success>', () => {
		it('should successfully delete the user', (done) => {
			jest.spyOn(users, 'delete').mockResolvedValue(true);

			controller
				.deleteOne({ sub: '1' })
				.pipe(take(1))
				.subscribe((result) => {
					expect(users.delete).toHaveBeenCalledWith('1');
					expect(result).toEqual({ success: true });

					done();
				});
		});
	});
});
