import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { TokenWhitelist } from '@Entities/token-whitelist';
import { createRepositoryFunctions } from './repository-functions';

export const TOKEN_WHITELIST_REPOSITORY_TOKEN = getRepositoryToken(TokenWhitelist);

export const provideTokenWhitelistRepository: () => Provider = () => {
	return {
		provide: TOKEN_WHITELIST_REPOSITORY_TOKEN,
		useFactory: jest.fn(() => createRepositoryFunctions<TokenWhitelist>()),
	};
};
