import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { ProjectMilestoneService } from '../services';
import { ProjectMilestoneController } from './project-milestone.controller';
import { provideProjectMilestoneRepository } from '@Mocks/Providers/project-milestone-repository.provider';

describe('Controller: ProjectMilestoneController', () => {
	let controller: ProjectMilestoneController;
	let projectMilestoneService: ProjectMilestoneService;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [ProjectMilestoneService, provideProjectMilestoneRepository()],
			controllers: [ProjectMilestoneController],
		}).compile();

		projectMilestoneService = module.get(ProjectMilestoneService);
		controller = module.get(ProjectMilestoneController);
	});

	it('should be created', () => {
		expect(projectMilestoneService).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	it('should find all milestones', (done) => {
		jest
			.spyOn(projectMilestoneService, 'findAll')
			.mockResolvedValue(['Milestone 1', 'Milestone 2'] as any[]);

		controller
			.findAll({}, {}, {})
			.pipe(take(1))
			.subscribe((result) => {
				expect(projectMilestoneService.findAll).toHaveBeenCalledWith({}, {}, {});
				expect(result).toEqual(['Milestone 1', 'Milestone 2']);

				done();
			});
	});

	it('should create a new milestone', (done) => {
		jest.spyOn(projectMilestoneService, 'createOne').mockResolvedValue('Created Milestone' as any);

		controller
			.create({ name: 'New Milestone' })
			.pipe(take(1))
			.subscribe((result) => {
				expect(projectMilestoneService.createOne).toHaveBeenCalledWith({ name: 'New Milestone' });
				expect(result).toEqual('Created Milestone');

				done();
			});
	});

	it('should find a specific milestone estimate', (done) => {
		jest.spyOn(projectMilestoneService, 'findOne').mockResolvedValue('Milestone' as any);

		controller
			.findOne('1', {}, {}, {})
			.pipe(take(1))
			.subscribe((result) => {
				expect(projectMilestoneService.findOne).toHaveBeenCalledWith('1', {}, {}, {});
				expect(result).toEqual('Milestone');

				done();
			});
	});
});
