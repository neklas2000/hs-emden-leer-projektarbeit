import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { createRepositoryFunctions } from './repository-functions';
import { Project } from '@Routes/Project/entities';

export const PROJECT_REPOSITORY_TOKEN = getRepositoryToken(Project);

export const provideProjectRepository: () => Provider = () => {
  return {
    provide: PROJECT_REPOSITORY_TOKEN,
    useFactory: jest.fn(() => createRepositoryFunctions<Project>()),
  };
};
