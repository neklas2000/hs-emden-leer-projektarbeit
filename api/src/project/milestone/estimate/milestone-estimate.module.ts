import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MilestoneEstimateController } from './controllers';
import { MilestoneEstimate } from './entities';
import { MilestoneEstimateService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([MilestoneEstimate])],
  providers: [MilestoneEstimateService],
  controllers: [MilestoneEstimateController],
})
export class MilestoneEstimateModule {}
