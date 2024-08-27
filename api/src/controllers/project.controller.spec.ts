import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { ProjectController } from '@Controllers/project.controller';
import { Project } from '@Entities/project';
import { DateService } from '@Services/date.service';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';
import { ProjectService } from '@Services/project.service';
import { ProjectMemberService } from '@Services/project-member.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { provideMilestoneEstimateRepository } from '@Test/Providers/milestone-estimate-repository.provider';
import { provideProjectRepository } from '@Test/Providers/project-repository.provider';
import { provideProjectMemberRepository } from '@Test/Providers/project-member-repository.provider';
import { provideProjectMilestoneRepository } from '@Test/Providers/project-milestone-repository.provider';

describe('Controller: ProjectController', () => {
	let controller: ProjectController;
	let projects: ProjectService;
	let storedProjects: Project[];

	beforeEach(async () => {
		storedProjects = [
			{
				id: '1',
				name: 'Test',
				officialStart: '2024-01-01',
				officialEnd: '2024-01-29',
				reportInterval: 7,
				type: 'Softwareproject',
				owner: {
					id: '12',
				},
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
			controllers: [ProjectController],
		}).compile();

		projects = module.get(ProjectService);
		controller = module.get(ProjectController);
	});

	it('should create', () => {
		expect(projects).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	describe('findAll<T = Project>(FindOptionsWhere<T>, FindOptionsSelect<T>, FindOptionsRelations<T>, Express.User): Observable<T[]>', () => {
		it('should find all available projects', (done) => {
			jest.spyOn(projects, 'findAll').mockResolvedValue(storedProjects);

			controller
				.findAll({}, { owner: { id: true } }, { owner: true }, { sub: '12' })
				.pipe(take(1))
				.subscribe((result) => {
					expect(projects.findAll).toHaveBeenCalledWith(
						'12',
						{},
						{ owner: { id: true } },
						{ owner: true },
					);
					expect(result).toEqual(storedProjects);

					done();
				});
		});
	});

	describe('findOne<T = Project>(string, FindOptionsWhere<T>, FindOptionsSelect<T>, FindOptionsRelations<T>): Observable<T>', () => {
		it('should find a specific project', (done) => {
			jest.spyOn(projects, 'findOne').mockResolvedValue(storedProjects[0]);

			controller
				.findOne('1', {}, { owner: { id: true } }, { owner: true })
				.pipe(take(1))
				.subscribe((result) => {
					expect(projects.findOne).toHaveBeenCalledWith(
						'1',
						{},
						{ owner: { id: true } },
						{ owner: true },
					);
					expect(result).toEqual(storedProjects[0]);

					done();
				});
		});
	});

	describe('create(DeepPartial<Project>, Express.User): Observable<Success>', () => {
		it('should create a project', (done) => {
			const partialProject = { ...storedProjects[1] };
			delete partialProject.id;
			jest.spyOn(projects, 'create').mockResolvedValue(storedProjects[1]);

			controller
				.create(partialProject, { sub: '12' })
				.pipe(take(1))
				.subscribe((result) => {
					expect(projects.create).toHaveBeenCalledWith(partialProject, '12');
					expect(result).toEqual(storedProjects[1]);

					done();
				});
		});
	});

	describe('update(string, DeepPartial<Project>): Observable<Success>', () => {
		it('should update a project', (done) => {
			const updated = { ...storedProjects[1] };
			delete updated.id;
			delete updated.officialStart;
			delete updated.reportInterval;
			delete updated.type;
			delete updated.owner;
			updated.name = 'Updated Test';
			updated.officialEnd = '2024-01-22';
			jest.spyOn(projects, 'update').mockResolvedValue(true);

			controller
				.update('1', updated)
				.pipe(take(1))
				.subscribe((result) => {
					expect(projects.update).toHaveBeenCalledWith('1', updated);
					expect(result).toEqual({ success: true });

					done();
				});
		});
	});

	describe('delete(string, Express.User): Observable<Success>', () => {
		it('should delete a project', (done) => {
			jest.spyOn(projects, 'delete').mockResolvedValue(true);

			controller
				.delete('1', { sub: '12' })
				.pipe(take(1))
				.subscribe((result) => {
					expect(projects.delete).toHaveBeenCalledWith('1', '12');
					expect(result).toEqual({ success: true });

					done();
				});
		});
	});
});
