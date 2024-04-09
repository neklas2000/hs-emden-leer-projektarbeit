import { Test } from '@nestjs/testing';

import { Repository } from "typeorm";

import { TokenWhitelistService } from "./token-whitelist.service";
import { TokenWhitelist } from "../entities";
import {
  provideTokenWhitelistRepository,
  TOKEN_WHITELIST_REPOSITORY_TOKEN
} from '@Mocks/Providers/token-whitelist-repository.provider';

describe('Service: TokenWhitelistService', () => {
  let tokenWhitelist: TokenWhitelistService;
  let tokenWhitelistRepository: Repository<TokenWhitelist>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TokenWhitelistService,
        provideTokenWhitelistRepository(),
      ]
    }).compile();

    tokenWhitelistRepository = module.get(TOKEN_WHITELIST_REPOSITORY_TOKEN);
    tokenWhitelist = module.get(TokenWhitelistService);
  });

  it('should be created', () => {
    expect(tokenWhitelist).toBeTruthy();
  });
});
