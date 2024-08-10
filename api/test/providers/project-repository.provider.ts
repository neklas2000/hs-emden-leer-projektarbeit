import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Project } from '@Entities/project';
import { createRepositoryFunctions } from './repository-functions';

export const PROJECT_REPOSITORY_TOKEN = getRepositoryToken(Project);

export const provideProjectRepository: () => Provider = () => {
	return {
		provide: PROJECT_REPOSITORY_TOKEN,
		useFactory: jest.fn(() => createRepositoryFunctions<Project>()),
	};
};
