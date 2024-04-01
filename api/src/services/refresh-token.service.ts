import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';

import { RefreshToken } from 'src/entities/refresh-token';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async update(userId: string, refreshToken: string): Promise<void> {
    const refreshTokenEntry = await this.findById(userId);

    if (refreshTokenEntry === null) {
      const newRecord = this.refreshTokenRepository.create({
        user: {
          id: userId,
        },
        token: refreshToken,
      });

      await newRecord.save();

      return;
    }

    refreshTokenEntry.token = refreshToken;
    await refreshTokenEntry.save();
  }

  delete(userId: string): Promise<DeleteResult> {
    return this.refreshTokenRepository.delete({
      user: {
        id: userId,
      },
    });
  }

  findById(userId: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}
