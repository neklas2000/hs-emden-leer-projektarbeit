import { Test, TestingModule } from '@nestjs/testing';
import { TokenWhitelistService } from './token-whitelist.service';

describe('TokenWhitelistService', () => {
  let service: TokenWhitelistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenWhitelistService],
    }).compile();

    service = module.get<TokenWhitelistService>(TokenWhitelistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
