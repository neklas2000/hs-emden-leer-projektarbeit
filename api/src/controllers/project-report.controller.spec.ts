import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { ProjectReportController } from '@Controllers/project-report.controller';
import { ProjectReport } from '@Entities/project-report';
import { ProjectReportService } from '@Services/project-report.service';
import { provideProjectReportRepository } from '@Test/Providers/project-report-repository.provider';

describe('Controller: ProjectReportController', () => {
	let controller: ProjectReportController;
	let projectReports: ProjectReportService;
	let report: ProjectReport;

	beforeEach(async () => {
		report = {
			id: '12',
			reportDate: '2024-01-01',
			sequenceNumber: 1,
			deliverables: 'These are some deliverables',
			hazards: 'These are some hazards',
			objectives: 'These are some of our goals for the upcoming week',
			other: 'There is nothing more to say',
			project: {
				id: '1',
			},
		} as any;

		const module = await Test.createTestingModule({
			providers: [ProjectReportService, provideProjectReportRepository()],
			controllers: [ProjectReportController],
		}).compile();

		projectReports = module.get(ProjectReportService);
		controller = module.get(ProjectReportController);
	});

	it('should create', () => {
		expect(projectReports).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	describe('findOne<T = ProjectReport>(string, FindOptionsWhere<T>, FindOptionsSelect<T>, FindOptionsRelations<T>): Observable<T>', () => {
		it('should find a specific project report with all fields inlcuding the project relation', (done) => {
			jest.spyOn(projectReports, 'findOne').mockResolvedValue(report);

			controller
				.findOne('12', {}, { project: { id: true } }, { project: true })
				.pipe(take(1))
				.subscribe((result) => {
					expect(projectReports.findOne).toHaveBeenCalledWith(
						'12',
						{},
						{ project: { id: true } },
						{ project: true },
					);
					expect(result).toEqual(report);

					done();
				});
		});
	});

	describe('patchOne(string, DeepPartial<ProjectReport>): Observable<Success>', () => {
		it('should update an existing project report', (done) => {
			const partialReport = { ...report };
			delete partialReport.id;

			jest.spyOn(projectReports, 'patchOne').mockResolvedValue(true);

			controller
				.patchOne(report.id, partialReport)
				.pipe(take(1))
				.subscribe((result) => {
					expect(projectReports.patchOne).toHaveBeenCalledWith(report.id, partialReport);
					expect(result).toEqual({ success: true });

					done();
				});
		});
	});

	describe('create(DeepPartial<ProjectReport>): Observable<ProjectReport>', () => {
		it('should create a new project report', (done) => {
			const partialReport = { ...report };
			delete partialReport.id;

			jest.spyOn(projectReports, 'create').mockResolvedValue(report);

			controller
				.create(partialReport)
				.pipe(take(1))
				.subscribe((result) => {
					expect(projectReports.create).toHaveBeenCalledWith(partialReport);
					expect(result).toEqual(report);

					done();
				});
		});
	});
});
