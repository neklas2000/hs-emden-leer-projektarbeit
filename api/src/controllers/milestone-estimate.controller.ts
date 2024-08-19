import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import { DeepPartial } from 'typeorm';

import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { ValidUUIDPipe } from '@Pipes/valid-uuid.pipe';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';
import { Success } from '@Types/success';
import { promiseToObservable } from '@Utils/promise-to-oberservable';

@UseGuards(AccessTokenGuard)
@Controller('milestone/estimates')
export class MilestoneEstimateController {
	constructor(private readonly milestoneEstimateService: MilestoneEstimateService) {}

	@Post()
	create(
		@Body()
		payload: DeepPartial<MilestoneEstimate>,
	): Observable<MilestoneEstimate> {
		return promiseToObservable(this.milestoneEstimateService.create(payload));
	}

	@Patch(':id')
	update(
		@Param('id', ValidUUIDPipe)
		id: string,
		@Body()
		payload: DeepPartial<MilestoneEstimate>,
	): Observable<Success> {
		return promiseToObservable(this.milestoneEstimateService.update(id, payload), (success) => {
			return {
				success,
			};
		}) as Observable<Success>;
	}

	@Delete(':id')
	delete(
		@Param('id', ValidUUIDPipe)
		id: string,
	): Observable<Success> {
		return promiseToObservable(this.milestoneEstimateService.delete(id), (success) => {
			return {
				success,
			};
		}) as Observable<Success>;
	}
}
