import { Test } from '@nestjs/testing';

import { DateTime } from 'luxon';
import { Repository } from 'typeorm';

import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { BadRequestException } from '@Exceptions/bad-request.exception';
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';
import { DateService } from '@Services/date.service';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';
import {
	MILESTONE_ESTIMATE_REPOSITORY_TOKEN,
	provideMilestoneEstimateRepository,
} from '@Test/Providers/milestone-estimate-repository.provider';

describe('Service: MilestoneEstimateService', () => {
	let service: MilestoneEstimateService;
	let repository: Repository<MilestoneEstimate>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [MilestoneEstimateService, provideMilestoneEstimateRepository(), DateService],
		}).compile();

		service = module.get(MilestoneEstimateService);
		repository = module.get(MILESTONE_ESTIMATE_REPOSITORY_TOKEN);
	});

	it('should create', () => {
		expect(service).toBeTruthy();
	});

	describe('create(DeepPartial<MilestoneEstimate>): Promise<MilestoneEstimate>', () => {
		it('should insert a new estimate and not be needed to parse the provided dates', (done) => {
			jest.spyOn(repository, 'insert').mockResolvedValue({
				identifiers: [
					{
						id: '1',
					},
				],
			} as any);

			service.create({ reportDate: '2024-01-01', estimationDate: '2024-01-15' }).then((result) => {
				expect(result).toEqual({
					id: '1',
					reportDate: '2024-01-01',
					estimationDate: '2024-01-15',
				});

				done();
			});
		});

		it('should insert a new estimate and be needed to parse the provided dates', (done) => {
			jest.spyOn(repository, 'insert').mockResolvedValue({
				identifiers: [
					{
						id: '1',
					},
				],
			} as any);

			service
				.create({
					reportDate: DateTime.fromSQL('2024-01-01').toJSDate(),
					estimationDate: DateTime.fromSQL('2024-01-15').toJSDate(),
				} as any)
				.then((result) => {
					expect(result).toEqual({
						id: '1',
						reportDate: '2024-01-01',
						estimationDate: '2024-01-15',
					});

					done();
				});
		});
	});

	describe('update(string, DeepPartial<MilestoneEstimate>): Promise<boolean>', () => {
		it('should throw an exception, due to a sql error', (done) => {
			const error = new Error('SQL ERROR: Sql query malformed');
			jest.spyOn(repository, 'update').mockRejectedValue(error);

			service.update('2', {}).catch((exception) => {
				expect(exception).toBeInstanceOf(BadRequestException);
				expect(exception).toHaveProperty('cause', error);

				done();
			});
		});

		it('should throw an exception, since a successful update could not be confirmed', (done) => {
			jest.spyOn(repository, 'update').mockResolvedValue({} as any);

			service.update('2', { estimationDate: '2024-01-22' }).catch((exception) => {
				expect(exception).toBeInstanceOf(NoAffectedRowException);

				done();
			});
		});

		it('should successfully update an estimate', (done) => {
			jest.spyOn(repository, 'update').mockResolvedValue({
				affected: 1,
				raw: '',
				generatedMaps: [],
			});

			service.update('1', { estimationDate: '2024-01-22' }).then((result) => {
				expect(result).toBe(true);

				done();
			});
		});
	});

	describe('delete(string): Promise<boolean>', () => {
		it('should throw an exception, due to a sql error', (done) => {
			const error = new Error('SQL ERROR: Sql query malformed');
			jest.spyOn(repository, 'delete').mockRejectedValue(error);

			service.delete('2').catch((exception) => {
				expect(exception).toBeInstanceOf(BadRequestException);
				expect(exception).toHaveProperty('cause', error);

				done();
			});
		});

		it('should throw an exception, since a successful delete could not be confirmed', (done) => {
			jest.spyOn(repository, 'delete').mockResolvedValue({} as any);

			service.delete('2').catch((exception) => {
				expect(exception).toBeInstanceOf(NoAffectedRowException);

				done();
			});
		});

		it('should successfully delete an estimate', (done) => {
			jest.spyOn(repository, 'delete').mockResolvedValue({
				affected: 1,
				raw: '',
			});

			service.delete('1').then((result) => {
				expect(result).toBe(true);

				done();
			});
		});
	});
});
