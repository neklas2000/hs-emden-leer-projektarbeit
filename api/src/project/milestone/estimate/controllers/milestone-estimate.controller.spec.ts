import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { MilestoneEstimateService } from '../services';
import { MilestoneEstimateController } from './milestone-estimate.controller';
import { provideMilestoneEstimateRepository } from '@Mocks/Providers/milestone-estimate-repository.provider';

describe('Controller: MilestoneEstimateController', () => {
	let controller: MilestoneEstimateController;
	let milestoneEstimateService: MilestoneEstimateService;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [MilestoneEstimateService, provideMilestoneEstimateRepository()],
			controllers: [MilestoneEstimateController],
		}).compile();

		milestoneEstimateService = module.get(MilestoneEstimateService);
		controller = module.get(MilestoneEstimateController);
	});

	it('should be created', () => {
		expect(milestoneEstimateService).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	it('should find all milestone estimates', (done) => {
		jest
			.spyOn(milestoneEstimateService, 'findAll')
			.mockResolvedValue(['Milestone estimate 1', 'Milestone estimate 2'] as any[]);

		controller
			.findAll({}, {}, {})
			.pipe(take(1))
			.subscribe((result) => {
				expect(milestoneEstimateService.findAll).toHaveBeenCalledWith({}, {}, {});
				expect(result).toEqual(['Milestone estimate 1', 'Milestone estimate 2']);

				done();
			});
	});

	it('should find a specific milestone estimate', (done) => {
		jest.spyOn(milestoneEstimateService, 'findOne').mockResolvedValue('Milestone estimate' as any);

		controller
			.findOne('1', {}, {}, {})
			.pipe(take(1))
			.subscribe((result) => {
				expect(milestoneEstimateService.findOne).toHaveBeenCalledWith('1', {}, {}, {});
				expect(result).toEqual('Milestone estimate');

				done();
			});
	});
});
