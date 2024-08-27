import { Test } from '@nestjs/testing';

import { Repository } from 'typeorm';

import { ProjectMilestone } from '@Entities/project-milestone';
import { BadRequestException } from '@Exceptions/bad-request.exception';
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';
import { DateService } from '@Services/date.service';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { provideMilestoneEstimateRepository } from '@Test/Providers/milestone-estimate-repository.provider';
import {
	PROJECT_MILESTONE_REPOSITORY_TOKEN,
	provideProjectMilestoneRepository,
} from '@Test/Providers/project-milestone-repository.provider';

describe('Service: ProjectMilestoneService', () => {
	let service: ProjectMilestoneService;
	let repository: Repository<ProjectMilestone>;
	let milestoneEstimates: MilestoneEstimateService;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				ProjectMilestoneService,
				provideProjectMilestoneRepository(),
				MilestoneEstimateService,
				provideMilestoneEstimateRepository(),
				DateService,
			],
		}).compile();

		service = module.get(ProjectMilestoneService);
		repository = module.get(PROJECT_MILESTONE_REPOSITORY_TOKEN);
		milestoneEstimates = module.get(MilestoneEstimateService);
	});

	it('should create', () => {
		expect(service).toBeTruthy();
	});

	describe('findAll(FindOptionsWhere, FindOptionsSelect, FindOptionsRelations): Promise<ProjectMilestone[]>', () => {
		it('should find all milestones', (done) => {
			jest.spyOn(repository, 'find').mockResolvedValue([
				{ id: '1', name: 'Milestone A' },
				{ id: '2', name: 'Milestone B' },
			] as any[]);

			service.findAll({}, { id: true, name: true }, {}).then((result) => {
				expect(repository.find).toHaveBeenCalledWith({
					where: {},
					select: { id: true, name: true },
					relations: {},
				});
				expect(result).toEqual([
					{ id: '1', name: 'Milestone A' },
					{ id: '2', name: 'Milestone B' },
				]);

				done();
			});
		});
	});

	describe('findOne(string, FindOptionsWhere, FindOptionsSelect, FindOptionsRelations): Promise<ProjectMilestone>', () => {
		it('should find a milestone by an id', (done) => {
			jest.spyOn(repository, 'findOne').mockResolvedValue({ id: '1', name: 'Milestone A' } as any);

			service.findOne('1', {}, { id: true, name: true }, {}).then((result) => {
				expect(repository.findOne).toHaveBeenCalledWith({
					where: {
						id: '1',
					},
					select: { id: true, name: true },
					relations: {},
				});
				expect(result).toEqual({ id: '1', name: 'Milestone A' });

				done();
			});
		});
	});

	describe('createOne(DeepPartial<ProjectMilestone>): Promise<ProjectMilestone>', () => {
		it('should create a new milestone and delete the id', (done) => {
			jest.spyOn(repository, 'insert').mockResolvedValue({ identifiers: [{ id: '243' }] } as any);

			service
				.createOne({
					id: null,
					name: 'Milestone',
				})
				.then((result) => {
					expect(repository.insert).toHaveBeenCalledWith({ name: 'Milestone' });
					expect(result).toEqual({
						id: '243',
						name: 'Milestone',
						estimates: [],
						milestoneReached: false,
					});

					done();
				});
		});

		it('should create a new milestone and not delete the id', (done) => {
			jest.spyOn(repository, 'insert').mockResolvedValue({ identifiers: [{ id: '243' }] } as any);

			service
				.createOne({
					name: 'Milestone',
					estimates: [],
				})
				.then((result) => {
					expect(repository.insert).toHaveBeenCalledWith({
						name: 'Milestone',
						estimates: [],
					});
					expect(result).toEqual({
						id: '243',
						name: 'Milestone',
						estimates: [],
						milestoneReached: false,
					});

					done();
				});
		});
	});

	describe('createAll(DeepPartial<ProjectMilestone>[]): Promise<ProjectMilestone[]>', () => {
		it('should create all milestones', (done) => {
			jest
				.spyOn(repository, 'insert')
				.mockResolvedValueOnce({ identifiers: [{ id: '243' }] } as any)
				.mockResolvedValueOnce({ identifiers: [{ id: '244' }] } as any)
				.mockResolvedValue({ identifiers: [{ id: '245' }] } as any);

			service
				.createAll([
					{ name: 'Milestone A' },
					{ name: 'Milestone B' },
					{ name: 'Milestone C' },
				] as any[])
				.then((result) => {
					expect(result).toEqual([
						{ id: '243', name: 'Milestone A', estimates: [], milestoneReached: false },
						{ id: '244', name: 'Milestone B', estimates: [], milestoneReached: false },
						{ id: '245', name: 'Milestone C', estimates: [], milestoneReached: false },
					]);

					done();
				});
		});
	});

	describe('update(string, DeepPartial<ProjectMilestone>): Promise<boolean>', () => {
		it('should return true, since an empty object has been provided', (done) => {
			jest.spyOn(milestoneEstimates, 'update');
			jest.spyOn(repository, 'update');

			service.update('1', {}).then((result) => {
				expect(milestoneEstimates.update).not.toHaveBeenCalled();
				expect(repository.update).not.toHaveBeenCalled();
				expect(result).toBe(true);

				done();
			});
		});

		it('should successfully update some estimates', (done) => {
			jest.spyOn(milestoneEstimates, 'update').mockResolvedValue(true);
			jest.spyOn(repository, 'update');

			service
				.update('1', {
					estimates: [
						{ id: '12', estimationDate: '2024-01-15' },
						{ id: '13', estimationDate: '2024-01-22' },
					],
				})
				.then((result) => {
					expect(repository.update).not.toHaveBeenCalled();
					expect(result).toBe(true);

					done();
				});
		});

		it('should fail to update all estimates successfully', (done) => {
			jest.spyOn(milestoneEstimates, 'update').mockResolvedValueOnce(false).mockResolvedValue(true);
			jest.spyOn(repository, 'update');

			service
				.update('1', {
					estimates: [
						{ id: '12', estimationDate: '2024-01-15' },
						{ id: '13', estimationDate: '2024-01-22' },
					],
				})
				.then((result) => {
					expect(repository.update).not.toHaveBeenCalled();
					expect(result).toBe(false);

					done();
				});
		});

		it('should successfully update attributes of the milestone', (done) => {
			jest.spyOn(milestoneEstimates, 'update');
			jest.spyOn(repository, 'update').mockResolvedValueOnce({
				affected: 1,
				raw: '',
				generatedMaps: [],
			});

			service
				.update('1', {
					name: 'Updated milestone name',
				})
				.then((result) => {
					expect(milestoneEstimates.update).not.toHaveBeenCalled();
					expect(repository.update).toHaveBeenCalled();
					expect(result).toBe(true);

					done();
				});
		});

		it('should throw an exception, since the successful update of the milestone could not be confirmed', (done) => {
			jest.spyOn(milestoneEstimates, 'update');
			jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);

			service
				.update('1', {
					name: 'Updated milestone name',
				})
				.catch((exception) => {
					expect(milestoneEstimates.update).not.toHaveBeenCalled();
					expect(repository.update).toHaveBeenCalled();
					expect(exception).toBeInstanceOf(NoAffectedRowException);

					done();
				});
		});

		it('should throw an exception, due to a sql error', (done) => {
			jest.spyOn(milestoneEstimates, 'update');
			const error = new Error('SQL ERROR: Sql query malformed');
			jest.spyOn(repository, 'update').mockRejectedValue(error);

			service
				.update('1', {
					name: 'Updated milestone name',
				})
				.catch((exception) => {
					expect(milestoneEstimates.update).not.toHaveBeenCalled();
					expect(repository.update).toHaveBeenCalled();
					expect(exception).toBeInstanceOf(BadRequestException);
					expect(exception).toHaveProperty('cause', error);

					done();
				});
		});

		it('should successfully update the milestone and its estimates', (done) => {
			jest.spyOn(milestoneEstimates, 'update').mockResolvedValue(true);
			jest.spyOn(repository, 'update').mockResolvedValueOnce({
				affected: 1,
				raw: '',
				generatedMaps: [],
			});

			service
				.update('1', {
					name: 'Updated milestone name',
					estimates: [
						{ id: '12', estimationDate: '2024-01-15' },
						{ id: '13', estimationDate: '2024-01-22' },
					],
				})
				.then((result) => {
					expect(milestoneEstimates.update).toHaveBeenCalledTimes(2);
					expect(repository.update).toHaveBeenCalled();
					expect(result).toBe(true);

					done();
				});
		});
	});

	describe('delete(string): Promise<boolean>', () => {
		it('should throw an exception, due to a sql error', (done) => {
			const error = new Error('SQL ERROR: Sql query malformed');
			jest.spyOn(service, 'findOne').mockRejectedValue(error);

			service.delete('2').catch((exception) => {
				expect(exception).toBeInstanceOf(BadRequestException);
				expect(exception).toHaveProperty('cause', error);

				done();
			});
		});

		it('should throw an exception, since no milestone could be found under the given id', (done) => {
			jest.spyOn(service, 'findOne').mockResolvedValue(null);

			service.delete('2').catch((exception) => {
				expect(exception).toBeInstanceOf(BadRequestException);

				done();
			});
		});

		it('should successfully delete a milestone', (done) => {
			jest.spyOn(service, 'findOne').mockResolvedValue({
				remove: jest.fn().mockResolvedValue(true),
			} as any);

			service.delete('1').then((result) => {
				expect(result).toBe(true);

				done();
			});
		});
	});
});
