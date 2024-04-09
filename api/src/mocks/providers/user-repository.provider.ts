import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '@Routes/User/entities';

export const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

export const provideUserRepository: () => Provider = () => {
  return {
    provide: USER_REPOSITORY_TOKEN,
    useFactory: jest.fn(() => ({
      findOne: jest.fn(() => null),
    })),
  };
};
