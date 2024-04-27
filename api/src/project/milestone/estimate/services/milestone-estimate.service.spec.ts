import { Test } from '@nestjs/testing';

import { Repository } from 'typeorm';

import { MilestoneEstimate } from '../entities';
import {
	MILESTONE_ESTIMATE_REPOSITORY_TOKEN,
	provideMilestoneEstimateRepository,
} from '@Mocks/Providers/milestone-estimate-repository.provider';
import { MilestoneEstimateService } from './milestone-estimate.service';

describe('Service: MilestoneEstimateService', () => {
	let service: MilestoneEstimateService;
	let repository: Repository<MilestoneEstimate>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [MilestoneEstimateService, provideMilestoneEstimateRepository()],
		}).compile();

		service = module.get(MilestoneEstimateService);
		repository = module.get(MILESTONE_ESTIMATE_REPOSITORY_TOKEN);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should find all estimates', (done) => {
		jest
			.spyOn(repository, 'find')
			.mockResolvedValue(['Milestone Estimate 1', 'Milestone Estimate 2'] as any[]);

		service.findAll({}, {}, {}).then((result) => {
			expect(repository.find).toHaveBeenCalledWith({
				where: {},
				select: {},
				relations: {},
			});
			expect(result).toEqual(['Milestone Estimate 1', 'Milestone Estimate 2']);

			done();
		});
	});

	it('should find an estimate by the id', (done) => {
		jest.spyOn(repository, 'findOne').mockResolvedValue('Milestone Estimate' as any);

		service.findOne('1', {}, {}, {}).then((result) => {
			expect(repository.findOne).toHaveBeenCalledWith({
				where: {
					id: '1',
				},
				select: {},
				relations: {},
			});
			expect(result).toEqual('Milestone Estimate');

			done();
		});
	});
});
