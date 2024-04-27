import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { createRepositoryFunctions } from './repository-functions';
import { ProjectMilestone } from '@Routes/Project/milestone/entities';

export const PROJECT_MILESTONE_REPOSITORY_TOKEN = getRepositoryToken(ProjectMilestone);

export const provideProjectMilestoneRepository: () => Provider = () => {
	return {
		provide: PROJECT_MILESTONE_REPOSITORY_TOKEN,
		useFactory: jest.fn(() => createRepositoryFunctions<ProjectMilestone>()),
	};
};
