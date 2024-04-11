import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { ProjectMemberController } from './project-member.controller';
import { ProjectMemberService } from '../services';
import { provideProjectMemberRepository } from '@Mocks/Providers/project-member-repository.provider';

describe('Controller: ProjectMemberController', () => {
	let controller: ProjectMemberController;
	let projectMemberService: ProjectMemberService;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [ProjectMemberService, provideProjectMemberRepository()],
			controllers: [ProjectMemberController],
		}).compile();

		projectMemberService = module.get(ProjectMemberService);
		controller = module.get(ProjectMemberController);
	});

	it('should be created', () => {
		expect(projectMemberService).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	it('should find all members', (done) => {
		jest
			.spyOn(projectMemberService, 'findAll')
			.mockResolvedValue(['project member 1', 'project member 2'] as any[]);

		controller
			.findAll({}, {}, {})
			.pipe(take(1))
			.subscribe((result) => {
				expect(projectMemberService.findAll).toHaveBeenCalledWith({}, {}, {});
				expect(result).toEqual(['project member 1', 'project member 2']);

				done();
			});
	});

	it('should find a specific member', (done) => {
		jest.spyOn(projectMemberService, 'findOne').mockResolvedValue('project member' as any);

		controller
			.findOne('1', {}, {}, {})
			.pipe(take(1))
			.subscribe((result) => {
				expect(projectMemberService.findOne).toHaveBeenCalledWith('1', {}, {}, {});
				expect(result).toEqual('project member');

				done();
			});
	});
});
