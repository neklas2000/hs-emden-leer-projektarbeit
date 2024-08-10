import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { ProfileController } from '@Controllers/profile.controller';
import { CryptoService } from '@Services/crypto.service';
import { UserService } from '@Services/user.service';
import { provideUserRepository } from '@Test/Providers/user-repository.provider';

describe('Controller: ProfileController', () => {
	let userService: UserService;
	let controller: ProfileController;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [UserService, provideUserRepository(), CryptoService],
			controllers: [ProfileController],
		}).compile();

		userService = module.get(UserService);
		controller = module.get(ProfileController);
	});

	it('should be created', () => {
		expect(controller).toBeTruthy();
	});

	it('should get the profile of the user', (done) => {
		jest.spyOn(userService, 'findById').mockResolvedValue({
			id: '1',
			password: 'password',
		} as any);

		controller
			.getProfile({ sub: '1' })
			.pipe(take(1))
			.subscribe((result) => {
				expect(result).toEqual({ id: '1' });

				done();
			});
	});
});
