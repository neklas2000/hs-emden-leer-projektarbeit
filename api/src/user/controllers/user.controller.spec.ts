import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { UserController } from './user.controller';
import { UserService } from '../services';
import { provideUserRepository } from '@Mocks/Providers/user-repository.provider';

describe('Controller: UserController', () => {
	let controller: UserController;
	let userService: UserService;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [UserService, provideUserRepository()],
			controllers: [UserController],
		}).compile();

		userService = module.get(UserService);
		controller = module.get(UserController);
	});

	it('should be created', () => {
		expect(userService).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	it('should find all users', (done) => {
		jest.spyOn(userService, 'findAll').mockResolvedValue(['User 1', 'User 2'] as any[]);

		controller
			.findAll({}, {}, {})
			.pipe(take(1))
			.subscribe((result) => {
				expect(userService.findAll).toHaveBeenCalledWith({}, {}, {});
				expect(result).toEqual(['User 1', 'User 2']);

				done();
			});
	});

	it('should find a specific user', (done) => {
		jest.spyOn(userService, 'findOne').mockResolvedValue('User' as any);

		controller
			.findOne(1234567, {}, {}, {})
			.pipe(take(1))
			.subscribe((result) => {
				expect(userService.findOne).toHaveBeenCalledWith(1234567, {}, {}, {});
				expect(result).toEqual('User');

				done();
			});
	});
});
