import { Controller } from '@Common/decorators';
import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { CRUDControllerMixin } from '../crud-mixin.controller';
import { MilestoneEstimateService } from './milestone-estimate.service';

@Controller(() => MilestoneEstimate, {
	path: 'milestone-estimate',
	version: '1',
})
export class MilestoneEstimateController extends CRUDControllerMixin(MilestoneEstimate) {
	constructor(private readonly milestoneEstimates: MilestoneEstimateService) {
		super(milestoneEstimates);
	}
}
