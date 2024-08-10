import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { MilestoneEstimate } from '@Entities/milestone-estimate';

@Injectable()
export class MilestoneEstimateService {
	constructor(
		@InjectRepository(MilestoneEstimate)
		private readonly milestoneEstimateRepository: Repository<MilestoneEstimate>,
	) {}
}
