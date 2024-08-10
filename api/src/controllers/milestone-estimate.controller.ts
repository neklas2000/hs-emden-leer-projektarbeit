import { Controller, UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from '@Guards/access-token.guard';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';

@UseGuards(AccessTokenGuard)
@Controller('milestone/estimates')
export class MilestoneEstimateController {
	constructor(private readonly milestoneEstimateService: MilestoneEstimateService) {}
}
