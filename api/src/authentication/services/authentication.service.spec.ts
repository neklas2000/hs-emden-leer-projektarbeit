import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing';

import { AuthenticationService } from "./authentication.service";
import { TokenWhitelistService } from "./token-whitelist.service";
import { UserService } from "@Routes/User/services";
import {
  provideTokenWhitelistRepository,
} from '@Mocks/Providers/token-whitelist-repository.provider';
import { provideUserRepository } from "@Mocks/Providers/user-repository.provider";

describe('Service: AuthenticationService', () => {
  let authentication: AuthenticationService;
  let userService: UserService;
  let tokenWhitelist: TokenWhitelistService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        TokenWhitelistService,
        JwtService,
        UserService,
        provideTokenWhitelistRepository(),
        provideUserRepository(),
      ],
    }).compile();

    userService = module.get(UserService);
    tokenWhitelist = module.get(TokenWhitelistService);
    jwtService = module.get(JwtService);
    authentication = module.get(AuthenticationService);
  });

  it('should be created', () => {
    expect(authentication).toBeTruthy();
  });

  it('should logout an user', (done) => {
    const expectedResponse = {
      affected: 1,
      raw: '',
    };
    jest.spyOn(tokenWhitelist, 'delete').mockResolvedValue(expectedResponse);

    authentication.logout('1').then((result) => {
      expect(tokenWhitelist.delete).toHaveBeenCalled();
      expect(tokenWhitelist.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual(expectedResponse);

      done();
    });
  });
});
