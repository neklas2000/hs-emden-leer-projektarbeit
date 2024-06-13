import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { provideProjectMemberRepository } from '@Mocks/Providers/project-member-repository.provider';
import { provideProjectRepository } from '@Mocks/Providers/project-repository.provider';
import { provideUserRepository } from '@Mocks/Providers/user-repository.provider';
import { ProfileController } from './profile.controller';
import { UserService } from '@Routes/User/services';
import { ProjectMemberService } from '@Routes/Project/member/services';

describe('Controller: ProfileController', () => {
	let userService: UserService;
	let controller: ProfileController;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				UserService,
				provideUserRepository(),
				ProjectMemberService,
				provideProjectMemberRepository(),
				provideProjectRepository(),
			],
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
