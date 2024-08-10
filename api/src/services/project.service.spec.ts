import { Test } from '@nestjs/testing';

import { Repository } from 'typeorm';

import { Project } from '@Entities/project';
import { ProjectService } from '@Services/project.service';
import { ProjectMemberService } from '@Services/project-member.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import {
	PROJECT_REPOSITORY_TOKEN,
	provideProjectRepository,
} from '@Test/Providers/project-repository.provider';
import { provideProjectMemberRepository } from '@Test/Providers/project-member-repository.provider';
import { provideProjectMilestoneRepository } from '@Test/Providers/project-milestone-repository.provider';

describe('Service: ProjectService', () => {
	let service: ProjectService;
	let repository: Repository<Project>;

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
		}).compile();

		service = module.get(ProjectService);
		repository = module.get(PROJECT_REPOSITORY_TOKEN);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should load all projects', (done) => {
		jest.spyOn(repository, 'find').mockResolvedValue(['Project 1', 'Project 2'] as any[]);

		service.findAll('1', {}, {}, {}).then((result) => {
			expect(repository.find).toHaveBeenCalledWith({
				where: [
					{
						owner: {
							id: '1',
						},
					},
					{
						members: {
							user: {
								id: '1',
							},
						},
					},
					{},
				],
				select: {},
				relations: {},
			});
			expect(result).toEqual(['Project 1', 'Project 2']);

			done();
		});
	});

	it('should find a project by an id', (done) => {
		jest.spyOn(repository, 'findOne').mockResolvedValue('Project' as any);

		service.findOne('1', {}, {}, {}).then((result) => {
			expect(repository.findOne).toHaveBeenCalledWith({
				relations: {},
				select: {},
				where: {
					id: '1',
				},
			});
			expect(result).toEqual('Project');

			done();
		});
	});
});
