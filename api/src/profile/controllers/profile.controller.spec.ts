import { Test } from '@nestjs/testing';

import { ProfileController } from './profile.controller';

describe('Controller: ProfileController', () => {
	let controller: ProfileController;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [],
			controllers: [ProfileController],
		}).compile();

		controller = module.get(ProfileController);
	});

	it('should be created', () => {
		expect(controller).toBeTruthy();
	});

	it('should get the profile of the user', () => {
		expect(controller.getProfile('User')).toEqual('User');
	});
});
