import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { TokenWhitelist } from '@Routes/Authentication/entities';

export const TOKEN_WHITELIST_REPOSITORY_TOKEN = getRepositoryToken(TokenWhitelist);

export const provideTokenWhitelistRepository: () => Provider = () => {
  return {
    provide: TOKEN_WHITELIST_REPOSITORY_TOKEN,
    useFactory: jest.fn(() => ({
      findOne: jest.fn(() => null),
    })),
  };
};
