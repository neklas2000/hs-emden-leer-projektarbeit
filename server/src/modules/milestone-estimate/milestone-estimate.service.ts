import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { DateService } from '@Common/services';
import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { CRUDService } from '@Modules/crud.service';

@Injectable()
export class MilestoneEstimateService extends CRUDService<MilestoneEstimate> {
	constructor(
		@InjectRepository(MilestoneEstimate) repository: Repository<MilestoneEstimate>,
		private readonly date: DateService,
	) {
		super(repository);
	}
}
