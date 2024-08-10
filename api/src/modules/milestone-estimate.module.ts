import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MilestoneEstimateController } from '@Controllers/milestone-estimate.controller';
import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';

@Module({
	imports: [TypeOrmModule.forFeature([MilestoneEstimate])],
	providers: [MilestoneEstimateService],
	controllers: [MilestoneEstimateController],
})
export class MilestoneEstimateModule {}
