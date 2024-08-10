import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProjectReport } from '@Entities/project-report';
import { createRepositoryFunctions } from './repository-functions';

export const PROJECT_REPORT_REPOSITORY_TOKEN = getRepositoryToken(ProjectReport);

export const provideProjectReportRepository: () => Provider = () => {
	return {
		provide: PROJECT_REPORT_REPOSITORY_TOKEN,
		useFactory: jest.fn(() => createRepositoryFunctions<ProjectReport>()),
	};
};
