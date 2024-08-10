import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { createRepositoryFunctions } from './repository-functions';

export const MILESTONE_ESTIMATE_REPOSITORY_TOKEN = getRepositoryToken(MilestoneEstimate);

export const provideMilestoneEstimateRepository: () => Provider = () => {
	return {
		provide: MILESTONE_ESTIMATE_REPOSITORY_TOKEN,
		useFactory: jest.fn(() => createRepositoryFunctions<MilestoneEstimate>()),
	};
};
