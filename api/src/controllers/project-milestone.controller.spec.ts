import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { ProjectMilestoneController } from '@Controllers/project-milestone.controller';
import { ProjectMilestone } from '@Entities/project-milestone';
import { DateService } from '@Services/date.service';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { provideMilestoneEstimateRepository } from '@Test/Providers/milestone-estimate-repository.provider';
import { provideProjectMilestoneRepository } from '@Test/Providers/project-milestone-repository.provider';

describe('Controller: ProjectMilestoneController', () => {
	let controller: ProjectMilestoneController;
	let projectMilestones: ProjectMilestoneService;
	let milestones: ProjectMilestone[];

	beforeEach(async () => {
		milestones = [
			{
				id: '1',
				name: 'Milestone A',
				milestoneReached: false,
				estimates: [
					{
						id: '123',
						reportDate: '2024-01-01',
						estimationDate: '2024-01-15',
					},
					{
						id: '124',
						reportDate: '2024-01-08',
						estimationDate: '2024-01-15',
					},
				],
				project: {
					id: '12',
				},
			},
			{
				id: '2',
				name: 'Milestone B',
				milestoneReached: true,
				estimates: [
					{
						id: '125',
						reportDate: '2024-01-01',
						estimationDate: '2024-01-08',
					},
					{
						id: '126',
						reportDate: '2024-01-08',
						estimationDate: '2024-01-08',
					},
				],
				project: {
					id: '12',
				},
			},
		] as any[];

		const module = await Test.createTestingModule({
			providers: [
				ProjectMilestoneService,
				provideProjectMilestoneRepository(),
				MilestoneEstimateService,
				provideMilestoneEstimateRepository(),
				DateService,
			],
			controllers: [ProjectMilestoneController],
		}).compile();

		projectMilestones = module.get(ProjectMilestoneService);
		controller = module.get(ProjectMilestoneController);
	});

	it('should create', () => {
		expect(projectMilestones).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	describe('findAll<T = ProjectMilestone>(FindOptionsWhere<T>, FindOptionsSelect<T>, FindOptionsRelations<T>): Observable<T[]>', () => {
		it('should find all milestones', (done) => {
			jest.spyOn(projectMilestones, 'findAll').mockResolvedValue(milestones);
			const where = {
				project: {
					id: '12',
				},
			};
			const select = {
				estimates: {
					id: true,
					reportDate: true,
					estimationDate: true,
				},
				project: {
					id: true,
				},
			};
			const relations = {
				estimates: true,
				project: true,
			};

			controller
				.findAll(where, select, relations)
				.pipe(take(1))
				.subscribe((result) => {
					expect(projectMilestones.findAll).toHaveBeenCalledWith(where, select, relations);
					expect(result).toEqual(milestones);

					done();
				});
		});
	});

	describe('create(DeepPartial<ProjectMilestone>): Observable<ProjectMilestone>', () => {
		it('should create a new milestone', (done) => {
			const partialMilestone = { ...milestones[1] };
			delete partialMilestone.estimates;
			delete partialMilestone.id;
			partialMilestone.milestoneReached = false;
			const createdMilestone = { ...milestones[1] } as any;
			delete createdMilestone.estimates;

			jest.spyOn(projectMilestones, 'createOne').mockResolvedValue(createdMilestone);

			controller
				.create(partialMilestone)
				.pipe(take(1))
				.subscribe((result) => {
					expect(projectMilestones.createOne).toHaveBeenCalledWith(partialMilestone);
					expect(result).toEqual(createdMilestone);

					done();
				});
		});
	});

	describe('update(string, DeepPartial<ProjectMilestone>): Observable<Success>', () => {
		it('should update an existing milestone', (done) => {
			const partialMilestone = { ...milestones[1] };
			delete partialMilestone.estimates;
			delete partialMilestone.id;
			partialMilestone.name = 'Update Milestone name';

			jest.spyOn(projectMilestones, 'update').mockResolvedValue(true);

			controller
				.update(milestones[1].id, partialMilestone)
				.pipe(take(1))
				.subscribe((result) => {
					expect(projectMilestones.update).toHaveBeenCalledWith(milestones[1].id, partialMilestone);
					expect(result).toEqual({ success: true });

					done();
				});
		});
	});

	describe('delete(string): Observable<Success>', () => {
		it('should delete a milestone', (done) => {
			jest.spyOn(projectMilestones, 'delete').mockResolvedValue(true);

			controller
				.delete(milestones[1].id)
				.pipe(take(1))
				.subscribe((result) => {
					expect(projectMilestones.delete).toHaveBeenCalledWith(milestones[1].id);
					expect(result).toEqual({ success: true });

					done();
				});
		});
	});
});
