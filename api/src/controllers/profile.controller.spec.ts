import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { ProfileController } from '@Controllers/profile.controller';
import { User } from '@Entities/user';
import { IncorrectCredentialsException } from '@Exceptions/incorrect-credentials.exception';
import { CryptoService } from '@Services/crypto.service';
import { UserService } from '@Services/user.service';
import { provideUserRepository } from '@Test/Providers/user-repository.provider';

describe('Controller: ProfileController', () => {
	let users: UserService;
	let controller: ProfileController;
	let user: User;

	beforeEach(async () => {
		user = {
			id: '123',
			academicTitle: null,
			firstName: 'Max',
			lastName: 'Mustermann',
			email: 'max.mustermann@gmx.de',
			password: 'very secure password',
			matriculationNumber: 1234567,
			phoneNumber: null,
			projects: [],
			tokenPair: null,
		} as any;

		const module = await Test.createTestingModule({
			providers: [UserService, provideUserRepository(), CryptoService],
			controllers: [ProfileController],
		}).compile();

		users = module.get(UserService);
		controller = module.get(ProfileController);
	});

	it('should create', () => {
		expect(users).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	describe('getProfile(Express.User): Observable<User>', () => {
		it('should find the profile and delete the password field', (done) => {
			const expectedUser = { ...user };
			delete expectedUser.password;
			jest.spyOn(users, 'findById').mockResolvedValue(user);

			controller
				.getProfile({ sub: '123' })
				.pipe(take(1))
				.subscribe((result) => {
					expect(users.findById).toHaveBeenCalledWith('123');
					expect(result).toEqual(expectedUser);

					done();
				});
		});
	});

	describe('getProfileById(string, FindOptionsWhere<User>): Observable<User>', () => {
		it('should find the profile and delete the password field', (done) => {
			const expectedUser = { ...user };
			delete expectedUser.password;
			const where = {
				firstName: 'Max',
			};
			jest.spyOn(users, 'findByIdAndCredentials').mockResolvedValue(user);

			controller
				.getProfileById('123', where)
				.pipe(take(1))
				.subscribe((result) => {
					expect(users.findByIdAndCredentials).toHaveBeenCalledWith('123', where);
					expect(result).toEqual(expectedUser);

					done();
				});
		});

		it('should should throw an exception, since no profile could be found', (done) => {
			jest.spyOn(users, 'findByIdAndCredentials').mockResolvedValue(null);

			controller
				.getProfileById('123', {})
				.pipe(take(1))
				.subscribe({
					error: (exception) => {
						expect(users.findByIdAndCredentials).toHaveBeenCalledWith('123', {});
						expect(exception).toBeInstanceOf(IncorrectCredentialsException);

						done();
					},
				});
		});
	});

	describe('updateProfile(string, DeepPartial<User>): Observable<Success>', () => {
		it('should update the profile and return true', (done) => {
			const updated = { ...user };
			delete updated.id;
			delete updated.password;
			delete updated.projects;
			jest.spyOn(users, 'update').mockResolvedValue(user);

			controller
				.updateProfile('123', updated)
				.pipe(take(1))
				.subscribe((result) => {
					expect(users.update).toHaveBeenCalledWith('123', updated);
					expect(result).toEqual({ success: true });

					done();
				});
		});

		it('should not be able to update the profile and return false', (done) => {
			const updated = { ...user };
			delete updated.id;
			delete updated.password;
			delete updated.projects;
			jest.spyOn(users, 'update').mockResolvedValue(null);

			controller
				.updateProfile('123', updated)
				.pipe(take(1))
				.subscribe((result) => {
					expect(users.update).toHaveBeenCalledWith('123', updated);
					expect(result).toEqual({ success: false });

					done();
				});
		});
	});
});
