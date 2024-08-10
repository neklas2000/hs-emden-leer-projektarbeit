import { Test } from '@nestjs/testing';

import { MilestoneEstimateController } from '@Controllers/milestone-estimate.controller';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';
import { provideMilestoneEstimateRepository } from '@Test/Providers/milestone-estimate-repository.provider';

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
});
