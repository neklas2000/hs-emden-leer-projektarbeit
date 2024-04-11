import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { createRepositoryFunctions } from './repository-functions';
import { ProjectMember } from '@Routes/Project/member/entities';

export const PROJECT_MEMBER_REPOSITORY_TOKEN =
  getRepositoryToken(ProjectMember);

export const provideProjectMemberRepository: () => Provider = () => {
  return {
    provide: PROJECT_MEMBER_REPOSITORY_TOKEN,
    useFactory: jest.fn(() => createRepositoryFunctions<ProjectMember>()),
  };
};
