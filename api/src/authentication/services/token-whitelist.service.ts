import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as crypto from 'crypto-js';
import { DeleteResult, Repository } from 'typeorm';

import { TokenWhitelist } from '../entities';
import { currentTimestampWithOffset } from '../../utils';

export type TokenPairAndOwner = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};

@Injectable()
export class TokenWhitelistService {
  constructor(
    @InjectRepository(TokenWhitelist)
    private readonly tokenWhitelistRepository: Repository<TokenWhitelist>,
  ) {}

  async update({
    accessToken,
    refreshToken,
    userId,
  }: TokenPairAndOwner): Promise<void> {
    const tokenWhitelistEntry = await this.findByUser(userId);

    if (tokenWhitelistEntry !== null) {
      await this.tokenWhitelistRepository.remove(tokenWhitelistEntry);
    }

    const accessTokenExpirationDate = currentTimestampWithOffset(30, 'minutes');
    console.log('Expiration Date to be stored: ' + accessTokenExpirationDate);

    const newRecord = this.tokenWhitelistRepository.create({
      user: {
        id: userId,
      },
      accessToken,
      accessTokenExpirationDate,
      refreshToken,
      refreshTokenExpirationDate: currentTimestampWithOffset(7, 'days'),
    });

    await newRecord.save();

    return;
  }

  delete(userId: string): Promise<DeleteResult> {
    return this.tokenWhitelistRepository.delete({
      user: {
        id: userId,
      },
    });
  }

  findByUser(userId: string): Promise<TokenWhitelist> {
    return this.tokenWhitelistRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async verifyAccessToken(
    userId: string,
    accessToken: string,
  ): Promise<boolean> {
    const hashedAccessToken = crypto
      .SHA256(accessToken)
      .toString(crypto.enc.Hex);

    const tokenWhitelistEntry = await this.findByUser(userId);

    if (tokenWhitelistEntry === null) return false;

    return tokenWhitelistEntry.accessToken === hashedAccessToken;
  }

  async verifyRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const hashedRefreshToken = crypto
      .SHA256(refreshToken)
      .toString(crypto.enc.Hex);

    const tokenWhitelistEntry = await this.findByUser(userId);

    if (tokenWhitelistEntry === null) return false;

    return tokenWhitelistEntry.refreshToken === hashedRefreshToken;
  }
}
