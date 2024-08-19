import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MilestoneEstimateController } from '@Controllers/milestone-estimate.controller';
import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { DateService } from '@Services/date.service';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';

@Module({
	imports: [TypeOrmModule.forFeature([MilestoneEstimate])],
	providers: [MilestoneEstimateService, DateService],
	controllers: [MilestoneEstimateController],
	exports: [MilestoneEstimateService],
})
export class MilestoneEstimateModule {}
