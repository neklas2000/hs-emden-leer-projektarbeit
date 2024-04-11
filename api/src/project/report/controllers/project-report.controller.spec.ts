import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { ProjectReportService } from '../services';
import { ProjectReportController } from './project-report.controller';
import { provideProjectReportRepository } from '@Mocks/Providers/project-report-repository.provider';

describe('Controller: ProjectReportController', () => {
	let controller: ProjectReportController;
	let projectReportService: ProjectReportService;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [ProjectReportService, provideProjectReportRepository()],
			controllers: [ProjectReportController],
		}).compile();

		projectReportService = module.get(ProjectReportService);
		controller = module.get(ProjectReportController);
	});

	it('should be created', () => {
		expect(projectReportService).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	it('should find all project reports', (done) => {
		jest
			.spyOn(projectReportService, 'findAll')
			.mockResolvedValue(['project report 1', 'project report 2'] as any[]);

		controller
			.findAll({}, {}, {})
			.pipe(take(1))
			.subscribe((result) => {
				expect(projectReportService.findAll).toHaveBeenCalledWith({}, {}, {});
				expect(result).toEqual(['project report 1', 'project report 2']);

				done();
			});
	});

	it('should find a specific project report', (done) => {
		jest.spyOn(projectReportService, 'findOne').mockResolvedValue('project report' as any);

		controller
			.findOne('1', {}, {}, {})
			.pipe(take(1))
			.subscribe((result) => {
				expect(projectReportService.findOne).toHaveBeenCalledWith('1', {}, {}, {});
				expect(result).toEqual('project report');

				done();
			});
	});

	describe('patchOne(string, DeepPartial<ProjectReport>)', () => {
		it('should successfully patch a project report', (done) => {
			jest.spyOn(projectReportService, 'patchOne').mockResolvedValue(true);

			controller
				.patchOne('1', { hazards: 'Updated hazards' })
				.pipe(take(1))
				.subscribe((result) => {
					expect(projectReportService.patchOne).toHaveBeenCalledWith('1', {
						hazards: 'Updated hazards',
					});
					expect(result).toEqual({ success: true });

					done();
				});
		});

		it('should throw an exception when patching a project report', (done) => {
			jest.spyOn(projectReportService, 'patchOne').mockRejectedValue('Exception while patching');

			controller
				.patchOne('1', { hazards: 'Updated hazards' })
				.pipe(take(1))
				.subscribe({
					error: (exception) => {
						expect(projectReportService.patchOne).toHaveBeenCalledWith('1', {
							hazards: 'Updated hazards',
						});
						expect(exception).toEqual('Exception while patching');

						done();
					},
				});
		});
	});
});
