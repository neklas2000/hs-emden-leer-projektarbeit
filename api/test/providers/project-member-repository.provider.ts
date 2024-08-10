import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProjectMember } from '@Entities/project-member';
import { createRepositoryFunctions } from './repository-functions';

export const PROJECT_MEMBER_REPOSITORY_TOKEN = getRepositoryToken(ProjectMember);

export const provideProjectMemberRepository: () => Provider = () => {
	return {
		provide: PROJECT_MEMBER_REPOSITORY_TOKEN,
		useFactory: jest.fn(() => createRepositoryFunctions<ProjectMember>()),
	};
};
