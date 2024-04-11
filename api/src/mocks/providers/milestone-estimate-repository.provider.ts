import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { createRepositoryFunctions } from './repository-functions';
import { MilestoneEstimate } from '@Routes/Project/milestone/estimate/entities';

export const MILESTONE_ESTIMATE_REPOSITORY_TOKEN =
  getRepositoryToken(MilestoneEstimate);

export const provideMilestoneEstimateRepository: () => Provider = () => {
  return {
    provide: MILESTONE_ESTIMATE_REPOSITORY_TOKEN,
    useFactory: jest.fn(() => createRepositoryFunctions<MilestoneEstimate>()),
  };
};
