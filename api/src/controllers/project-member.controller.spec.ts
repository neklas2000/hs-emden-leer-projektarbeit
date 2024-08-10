import { Test } from '@nestjs/testing';

import { ProjectMemberController } from '@Controllers/project-member.controller';
import { CryptoService } from '@Services/crypto.service';
import { ProjectMemberService } from '@Services/project-member.service';
import { UserService } from '@Services/user.service';
import { provideProjectRepository } from '@Test/Providers/project-repository.provider';
import { provideProjectMemberRepository } from '@Test/Providers/project-member-repository.provider';
import { provideUserRepository } from '@Test/Providers/user-repository.provider';

describe('Controller: ProjectMemberController', () => {
	let controller: ProjectMemberController;
	let projectMemberService: ProjectMemberService;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				ProjectMemberService,
				provideProjectMemberRepository(),
				UserService,
				provideUserRepository(),
				provideProjectRepository(),
				CryptoService,
			],
			controllers: [ProjectMemberController],
		}).compile();

		projectMemberService = module.get(ProjectMemberService);
		controller = module.get(ProjectMemberController);
	});

	it('should be created', () => {
		expect(projectMemberService).toBeTruthy();
		expect(controller).toBeTruthy();
	});
});
