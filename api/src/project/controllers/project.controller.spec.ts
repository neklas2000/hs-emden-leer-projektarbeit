import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { ProjectController } from './project.controller';
import { ProjectService } from '../services';
import { provideProjectRepository } from '@Mocks/Providers/project-repository.provider';
import { provideProjectMilestoneRepository } from '@Mocks/Providers/project-milestone-repository.provider';
import { provideProjectMemberRepository } from '@Mocks/Providers/project-member-repository.provider';
import { ProjectMilestoneService } from '../milestone/services';
import { ProjectMemberService } from '../member/services';

describe('Controller: ProjectController', () => {
	let controller: ProjectController;
	let projectService: ProjectService;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				ProjectService,
				ProjectMilestoneService,
				ProjectMemberService,
				provideProjectRepository(),
				provideProjectMilestoneRepository(),
				provideProjectMemberRepository(),
			],
			controllers: [ProjectController],
		}).compile();

		projectService = module.get(ProjectService);
		controller = module.get(ProjectController);
	});

	it('should be created', () => {
		expect(projectService).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	it('should find all projects', (done) => {
		jest.spyOn(projectService, 'findAll').mockResolvedValue(['project 1', 'project 2'] as any[]);

		controller
			.findAll({}, {}, {})
			.pipe(take(1))
			.subscribe((result) => {
				expect(projectService.findAll).toHaveBeenCalledWith({}, {}, {});
				expect(result).toEqual(['project 1', 'project 2']);

				done();
			});
	});

	it('should find a specific project', (done) => {
		jest.spyOn(projectService, 'findOne').mockResolvedValue('project' as any);

		controller
			.findOne('1', {}, {}, {})
			.pipe(take(1))
			.subscribe((result) => {
				expect(projectService.findOne).toHaveBeenCalledWith('1', {}, {}, {});
				expect(result).toEqual('project');

				done();
			});
	});
});
