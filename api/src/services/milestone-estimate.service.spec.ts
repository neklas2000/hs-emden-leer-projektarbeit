import { Test } from '@nestjs/testing';

// import { Repository } from 'typeorm';

// import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';
import {
	// MILESTONE_ESTIMATE_REPOSITORY_TOKEN,
	provideMilestoneEstimateRepository,
} from '@Test/Providers/milestone-estimate-repository.provider';

describe('Service: MilestoneEstimateService', () => {
	let service: MilestoneEstimateService;
	// let repository: Repository<MilestoneEstimate>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [MilestoneEstimateService, provideMilestoneEstimateRepository()],
		}).compile();

		service = module.get(MilestoneEstimateService);
		// repository = module.get(MILESTONE_ESTIMATE_REPOSITORY_TOKEN);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
