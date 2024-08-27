import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { Repository } from 'typeorm';

import { Project } from '@Entities/project';
import { ProjectRole } from '@Entities/project-member';
import { BadRequestException } from '@Exceptions/bad-request.exception';
import { DeleteProjectNotAllowedException } from '@Exceptions/delete-project-not-allowed.exception';
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';
import { DateService } from '@Services/date.service';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';
import { ProjectService } from '@Services/project.service';
import { ProjectMemberService } from '@Services/project-member.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { provideMilestoneEstimateRepository } from '@Test/Providers/milestone-estimate-repository.provider';
import {
	PROJECT_REPOSITORY_TOKEN,
	provideProjectRepository,
} from '@Test/Providers/project-repository.provider';
import { provideProjectMemberRepository } from '@Test/Providers/project-member-repository.provider';
import { provideProjectMilestoneRepository } from '@Test/Providers/project-milestone-repository.provider';

describe('Service: ProjectService', () => {
	let service: ProjectService;
	let repository: Repository<Project>;
	let milestones: ProjectMilestoneService;
	let members: ProjectMemberService;
	let projects: Project[];

	beforeEach(async () => {
		projects = [
			{
				id: '1',
				name: 'First Project',
				officialStart: '2024-01-01',
				reportInterval: 7,
				officialEnd: '2024-01-29',
				type: 'Softwareproject',
				owner: {
					id: '12',
				},
				reports: [],
				members: [],
				milestones: [],
			},
			{
				id: '2',
				name: 'Second Project',
				officialStart: '2024-03-01',
				reportInterval: 7,
				officialEnd: null,
				type: null,
				owner: {
					id: '13',
				},
				reports: [],
				members: [
					{
						role: ProjectRole.Contributor,
						user: {
							id: '12',
						},
					},
				],
				milestones: [],
			},
		] as any[];

		const module = await Test.createTestingModule({
			providers: [
				ProjectService,
				provideProjectRepository(),
				ProjectMilestoneService,
				provideProjectMilestoneRepository(),
				MilestoneEstimateService,
				provideMilestoneEstimateRepository(),
				DateService,
				ProjectMemberService,
				provideProjectMemberRepository(),
			],
		}).compile();

		service = module.get(ProjectService);
		repository = module.get(PROJECT_REPOSITORY_TOKEN);
		milestones = module.get(ProjectMilestoneService);
		members = module.get(ProjectMemberService);
	});

	it('should create', () => {
		expect(service).toBeTruthy();
	});

	describe('findAll(string, FindOptionsWhere, FindOptionsSelect, FindOptionsRelations): Promise<Project[]>', () => {
		it('should load all projects and remove given filters', (done) => {
			jest.spyOn(repository, 'find').mockResolvedValue(projects);

			service
				.findAll(
					'1',
					{
						owner: {
							id: '2',
						},
						members: {
							user: {
								id: '2',
							},
						},
					},
					{},
					{
						owner: true,
						reports: true,
						milestones: true,
						members: true,
					},
				)
				.then((result) => {
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
						relations: {
							owner: true,
							reports: true,
							milestones: true,
							members: true,
						},
					});
					expect(result).toEqual(projects);

					done();
				});
		});
	});

	describe('findOne(string, FindOptionsWhere, FindOptionsSelect, FindOptionsRelations): Promise<Project>', () => {
		it('should find a project by an id', (done) => {
			jest.spyOn(repository, 'findOne').mockResolvedValue(projects[0]);

			service
				.findOne(
					'1',
					{},
					{ owner: { id: true } },
					{
						owner: true,
						reports: true,
						milestones: true,
						members: true,
					},
				)
				.then((result) => {
					expect(repository.findOne).toHaveBeenCalledWith({
						relations: {
							owner: true,
							reports: true,
							milestones: true,
							members: true,
						},
						select: {
							owner: {
								id: true,
							},
						},
						where: {
							id: '1',
						},
					});
					expect(result).toEqual(projects[0]);

					done();
				});
		});
	});

	describe('create(DeepPartial<Project>, string): Promise<Project>', () => {
		it('should create a new project without members and milestones', (done) => {
			jest.spyOn(milestones, 'createAll');
			jest.spyOn(members, 'createAll');
			const createdProject = {
				id: '3',
				name: 'New Project',
				officialStart: '2024-06-01',
				reportInterval: 1,
				type: null,
				officialEnd: null,
			} as any;
			jest.spyOn(repository, 'create').mockReturnValue({
				save: jest.fn().mockResolvedValue(createdProject),
			} as any);

			service
				.create(
					{
						name: 'New Project',
						officialStart: '2024-06-01',
						reportInterval: 1,
						type: null,
						officialEnd: null,
					},
					'1',
				)
				.then((project) => {
					expect(repository.create).toHaveBeenCalledWith({
						name: 'New Project',
						officialStart: '2024-06-01',
						reportInterval: 1,
						type: null,
						officialEnd: null,
						owner: {
							id: '1',
						},
					});
					expect(milestones.createAll).not.toHaveBeenCalled();
					expect(members.createAll).not.toHaveBeenCalled();
					expect(project).toEqual(createdProject);

					done();
				});
		});

		it('should create a new project without members, but with milestones', (done) => {
			const createdMilestones = [
				{
					id: '12',
					name: 'Milestone A',
					milestoneReached: false,
				},
			] as any[];
			jest.spyOn(milestones, 'createAll').mockResolvedValue(createdMilestones);
			jest.spyOn(members, 'createAll');
			const createdProject = {
				id: '3',
				name: 'New Project',
				officialStart: '2024-06-01',
				reportInterval: 1,
				type: null,
				officialEnd: null,
				milestones: createdMilestones,
			} as any;
			jest.spyOn(repository, 'create').mockReturnValue({
				save: jest.fn().mockResolvedValue(createdProject),
			} as any);

			service
				.create(
					{
						name: 'New Project',
						officialStart: '2024-06-01',
						reportInterval: 1,
						type: null,
						officialEnd: null,
						milestones: [
							{
								name: 'Milestone A',
							},
						],
					},
					'1',
				)
				.then((project) => {
					expect(repository.create).toHaveBeenCalledWith({
						name: 'New Project',
						officialStart: '2024-06-01',
						reportInterval: 1,
						type: null,
						officialEnd: null,
						milestones: [
							{
								name: 'Milestone A',
							},
						],
						owner: {
							id: '1',
						},
					});
					expect(milestones.createAll).toHaveBeenCalled();
					expect(members.createAll).not.toHaveBeenCalled();
					expect(project).toEqual(createdProject);

					done();
				});
		});

		it('should create a new project with milestones and members', (done) => {
			const createdMilestones = [
				{
					id: '12',
					name: 'Milestone A',
					milestoneReached: false,
				},
			] as any[];
			const createdMembers = [
				{
					id: '123',
					role: ProjectRole.Contributor,
					user: {
						id: '31',
					},
				},
			] as any[];
			jest.spyOn(milestones, 'createAll').mockResolvedValue(createdMilestones);
			jest.spyOn(members, 'createAll').mockResolvedValue(createdMembers);
			const createdProject = {
				id: '3',
				name: 'New Project',
				officialStart: '2024-06-01',
				reportInterval: 1,
				type: null,
				officialEnd: null,
				milestones: createdMilestones,
				members: createdMembers,
			} as any;
			jest.spyOn(repository, 'create').mockReturnValue({
				save: jest.fn().mockResolvedValue(createdProject),
			} as any);

			service
				.create(
					{
						name: 'New Project',
						officialStart: '2024-06-01',
						reportInterval: 1,
						type: null,
						officialEnd: null,
						milestones: [
							{
								name: 'Milestone A',
							},
						],
						members: [
							{
								role: ProjectRole.Contributor,
								user: {
									id: '31',
								},
							},
						],
					},
					'1',
				)
				.then((project) => {
					expect(repository.create).toHaveBeenCalledWith({
						name: 'New Project',
						officialStart: '2024-06-01',
						reportInterval: 1,
						type: null,
						officialEnd: null,
						milestones: [
							{
								name: 'Milestone A',
							},
						],
						members: [
							{
								role: ProjectRole.Contributor,
								user: {
									id: '31',
								},
							},
						],
						owner: {
							id: '1',
						},
					});
					expect(milestones.createAll).toHaveBeenCalled();
					expect(members.createAll).toHaveBeenCalled();
					expect(project).toEqual(createdProject);

					done();
				});
		});

		it('should throw an exception, due to an error while creating the new resource', (done) => {
			const error = new Error('Could not create the new project');
			jest.spyOn(repository, 'create').mockReturnValue({
				save: jest.fn().mockRejectedValue(error),
			} as any);

			service.create({}, '1').catch((exception) => {
				expect(exception).toBeInstanceOf(BadRequestException);
				expect(exception).toHaveProperty('cause', error);

				done();
			});
		});
	});

	describe('update(string, DeepPartial<Project>): Promise<boolean>', () => {
		it('should throw an exception, since the update could not be confirmed', (done) => {
			jest.spyOn(repository, 'update').mockResolvedValue({} as any);

			service.update('1', {}).catch((exception) => {
				expect(repository.update).toHaveBeenCalledWith({ id: '1' }, {});
				expect(exception).toBeInstanceOf(NoAffectedRowException);

				done();
			});
		});

		it('should throw an exception, due to a sql error', (done) => {
			const error = new Error('There is an error within your sql statement');
			jest.spyOn(repository, 'update').mockRejectedValue(error);

			service.update('1', {}).catch((exception) => {
				expect(repository.update).toHaveBeenCalledWith({ id: '1' }, {});
				expect(exception).toBeInstanceOf(BadRequestException);
				expect(exception).toHaveProperty('cause', error);

				done();
			});
		});

		it('should return true, since the project could be updated', (done) => {
			jest.spyOn(repository, 'update').mockResolvedValue({
				affected: 1,
				raw: '',
				generatedMaps: [],
			});

			service.update('1', { name: 'New Project Name' }).then((isUpdated) => {
				expect(repository.update).toHaveBeenCalledWith({ id: '1' }, { name: 'New Project Name' });
				expect(isUpdated).toBe(true);

				done();
			});
		});
	});

	describe('delete(string, string): Promise<boolean>', () => {
		it('should throw an exception, since the project could not be found', (done) => {
			jest.spyOn(service, 'findOne').mockResolvedValue(null);

			service.delete('1', '123').catch((exception) => {
				expect(exception).toBeInstanceOf(NotFoundException);

				done();
			});
		});

		it('should throw an exception, since the project cannot be removed by someone who is not the owner', (done) => {
			jest.spyOn(service, 'findOne').mockResolvedValue(projects[0]);

			service.delete('1', '13').catch((exception) => {
				expect(exception).toBeInstanceOf(DeleteProjectNotAllowedException);

				done();
			});
		});

		it('should throw an exception, due to a sql error', (done) => {
			const error = new Error('There is an error in your sql statement');
			jest.spyOn(service, 'findOne').mockRejectedValue(error);

			service.delete('1', '12').catch((exception) => {
				expect(exception).toBeInstanceOf(BadRequestException);
				expect(exception).toHaveProperty('cause', error);

				done();
			});
		});

		it('should successfully remove a project', (done) => {
			jest.spyOn(service, 'findOne').mockResolvedValue({
				...projects[0],
				remove: jest.fn().mockResolvedValue(true),
			} as any);

			service.delete('1', '12').then((isDeleted) => {
				expect(isDeleted).toBe(true);

				done();
			});
		});
	});
});
