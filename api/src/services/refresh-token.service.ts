import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from 'src/entities/refresh-token';
import { Repository } from 'typeorm';

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

  async delete(userId: string): Promise<RefreshToken> {
    const refreshTokenEntry = await this.findById(userId);

    if (refreshTokenEntry !== null) {
      return await refreshTokenEntry.remove();
    }

    return null;
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
