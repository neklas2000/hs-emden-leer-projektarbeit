import { Test } from '@nestjs/testing';

import { Repository } from 'typeorm';

import { ProjectReport } from '@Entities/project-report';
import { BadRequestException } from '@Exceptions/bad-request.exception';
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';
import { ProjectReportService } from '@Services/project-report.service';
import {
	PROJECT_REPORT_REPOSITORY_TOKEN,
	provideProjectReportRepository,
} from '@Test/Providers/project-report-repository.provider';

describe('Service: ProjectReportService', () => {
	let service: ProjectReportService;
	let repository: Repository<ProjectReport>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [ProjectReportService, provideProjectReportRepository()],
		}).compile();

		service = module.get(ProjectReportService);
		repository = module.get(PROJECT_REPORT_REPOSITORY_TOKEN);
	});

	it('should create', () => {
		expect(service).toBeTruthy();
	});

	describe('findOne(string, FindOptionsWhere, FindOptionsSelect, FindOptionsRelations): Promise<ProjectReport>', () => {
		it('should find one project report by an id', (done) => {
			const report = {
				id: '1',
				sequenceNumber: 1,
				reportDate: '2024-01-01',
				deliverables: 'These are some deliverables',
				hazards: 'These are some hazards',
				objectives: 'These are some objectives',
				other: 'This is some other information',
			} as any;
			jest.spyOn(repository, 'findOne').mockResolvedValue(report);

			service.findOne('1', {}, {}, {}).then((result) => {
				expect(repository.findOne).toHaveBeenCalledWith({
					where: {
						id: '1',
					},
					select: {},
					relations: {},
				});
				expect(result).toEqual(report);

				done();
			});
		});
	});

	describe('patchOne(string, DeepPartial<ProjectReport>): Promise<boolean>', () => {
		it('should throw an exception, since there was an error with the sql query', (done) => {
			const error = new Error('SQL ERROR: Query malformed');
			jest.spyOn(repository, 'update').mockRejectedValue(error);

			service.patchOne('1', { hazards: 'Patched' }).catch((exception) => {
				expect(exception).toBeInstanceOf(BadRequestException);
				expect(exception).toHaveProperty('cause', error);

				done();
			});
		});

		it('should throw an exception, since the patch could not be confirmed', (done) => {
			jest.spyOn(repository, 'update').mockResolvedValue({
				affected: 0,
				raw: '',
				generatedMaps: [],
			});

			service.patchOne('1', { hazards: 'Patched' }).catch((exception) => {
				expect(exception).toBeInstanceOf(NoAffectedRowException);

				done();
			});
		});

		it('should successfully patch one project report', (done) => {
			jest.spyOn(repository, 'update').mockResolvedValue({
				affected: 1,
				raw: '',
				generatedMaps: [],
			});

			service.patchOne('1', { hazards: 'Patched' }).then((success) => {
				expect(repository.update).toHaveBeenCalledWith(
					{
						id: '1',
					},
					{
						hazards: 'Patched',
					},
				);
				expect(success).toBe(true);

				done();
			});
		});
	});

	describe('create(DeepPartial<ProjectReport>): Promise<ProjectReport>', () => {
		it('should create a new project report', (done) => {
			const report = {
				sequenceNumber: 2,
				reportDate: '2024-01-08',
				deliverables: 'These are some deliverables',
				hazards: 'These are some hazards',
				objectives: 'These are some objectives',
				other: 'This is some other information',
			} as any;
			jest.spyOn(repository, 'create').mockReturnValue({
				save: jest.fn().mockResolvedValue({
					...report,
					id: '2',
				}),
			} as any);

			service.create(report).then((result) => {
				expect(repository.create).toHaveBeenCalledWith(report);
				expect(result).toEqual({
					...report,
					id: '2',
				});

				done();
			});
		});
	});
});
