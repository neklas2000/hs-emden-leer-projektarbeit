import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { UserController } from '@Controllers/user.controller';
import { CryptoService } from '@Services/crypto.service';
import { UserService } from '@Services/user.service';
import { provideUserRepository } from '@Test/Providers/user-repository.provider';

describe('Controller: UserController', () => {
	let controller: UserController;
	let userService: UserService;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [UserService, provideUserRepository(), CryptoService],
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
});
