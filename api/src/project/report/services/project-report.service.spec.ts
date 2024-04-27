import { Test } from '@nestjs/testing';

import { Repository } from 'typeorm';

import { ProjectReport } from '../entities';
import {
	PROJECT_REPORT_REPOSITORY_TOKEN,
	provideProjectReportRepository,
} from '@Mocks/Providers/project-report-repository.provider';
import { ProjectReportService } from './project-report.service';
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';
import { BadRequestException } from '@Exceptions/bad-request.exception';

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

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should find all project reports', (done) => {
		jest
			.spyOn(repository, 'find')
			.mockResolvedValue(['Project Report 1', 'Project Report 2'] as any[]);

		service.findAll({}, {}, {}).then((result) => {
			expect(repository.find).toHaveBeenCalledWith({
				where: {},
				select: {},
				relations: {},
			});
			expect(result).toEqual(['Project Report 1', 'Project Report 2']);

			done();
		});
	});

	it('should find one project report by an id', (done) => {
		jest.spyOn(repository, 'findOne').mockResolvedValue('Project Report' as any);

		service.findOne('1', {}, {}, {}).then((result) => {
			expect(repository.findOne).toHaveBeenCalledWith({
				where: {
					id: '1',
				},
				select: {},
				relations: {},
			});
			expect(result).toEqual('Project Report');

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
			expect(success).toBeTruthy();

			done();
		});
	});

	it('should throw an exception since no record could be patched', (done) => {
		jest.spyOn(repository, 'update').mockResolvedValue({
			affected: 0,
			raw: '',
			generatedMaps: [],
		});

		service.patchOne('1', { hazards: 'Patched' }).catch((exception) => {
			expect(repository.update).toHaveBeenCalledWith(
				{
					id: '1',
				},
				{
					hazards: 'Patched',
				},
			);
			expect(exception).toBeInstanceOf(NoAffectedRowException);

			done();
		});
	});

	it('should throw an exception since there was an error with the sql query', (done) => {
		jest.spyOn(repository, 'update').mockRejectedValue('SQL ERROR: Query malformed');

		service.patchOne('1', { hazards: 'Patched' }).catch((exception) => {
			expect(repository.update).toHaveBeenCalledWith(
				{
					id: '1',
				},
				{
					hazards: 'Patched',
				},
			);
			expect(exception).toBeInstanceOf(BadRequestException);

			done();
		});
	});
});
